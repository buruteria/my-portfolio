const { Client } = require("@notionhq/client");

// シンプルなインメモリキャッシュ
const cache = {};
const CACHE_TTL_SECONDS = 300; // 5分間キャッシュを保持

const notion = new Client({ auth: process.env.NOTION_API_KEY });

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { databaseId, filter, sorts } = JSON.parse(event.body);

        if (!databaseId) {
            return { statusCode: 400, body: 'Database ID is required' };
        }

        // キャッシュキーを生成
        const cacheKey = JSON.stringify({ databaseId, filter, sorts });
        const cachedData = cache[cacheKey];

        // キャッシュが存在し、有効期限内の場合
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL_SECONDS * 1000)) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json', 'X-Cache-Status': 'Hit' },
                body: cachedData.data,
            };
        }

        // Notion APIへのリクエストを構築
        const requestPayload = {
            database_id: databaseId,
        };
        if (filter) {
            requestPayload.filter = filter;
        }
        if (sorts && sorts.length > 0) {
            requestPayload.sorts = sorts;
        }

        const response = await notion.databases.query(requestPayload);
        
        const responseBody = JSON.stringify(response);

        // 結果をキャッシュに保存
        cache[cacheKey] = {
            timestamp: Date.now(),
            data: responseBody,
        };

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'X-Cache-Status': 'Miss' },
            body: responseBody,
        };

    } catch (error) {
        console.error('Notion API Error:', error);
        return {
            statusCode: error.status || 500,
            body: JSON.stringify({
                message: error.message || "An internal server error occurred.",
                code: error.code
            }),
        };
    }
};