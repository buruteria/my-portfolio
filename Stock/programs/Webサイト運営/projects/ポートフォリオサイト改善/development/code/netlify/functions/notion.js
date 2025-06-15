export const handler = async (event) => {
  // ログは、Netlifyの管理画面 > Functions > notion で確認できます。

  console.log("--- 関数がトリガーされました ---");

  try {
    const { databaseId, filter, sorts } = JSON.parse(event.body);
    console.log("受け取ったデータベースID:", databaseId);
    console.log("受け取ったフィルター:", JSON.stringify(filter, null, 2));
    console.log("受け取ったソート条件:", JSON.stringify(sorts, null, 2));

    const NOTION_API_KEY = process.env.NOTION_API_KEY;
    if (!NOTION_API_KEY) {
      console.error("エラー: 環境変数 NOTION_API_KEY が設定されていません。");
      throw new Error("APIキーがサーバーに設定されていません。");
    }
    console.log("APIキーは正常に読み込まれました。");

    const NOTION_API_ENDPOINT = `https://api.notion.com/v1/databases/${databaseId}/query`;
    
    const requestBody = {};
    if (filter && typeof filter === 'object' && Object.keys(filter).length > 0) {
      requestBody.filter = filter;
    }
    if (sorts && Array.isArray(sorts) && sorts.length > 0) {
      requestBody.sorts = sorts;
    }
    console.log("Notion APIへのリクエストボディ:", JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(NOTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Notion APIからの応答ステータス:", response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Notion APIからのエラー応答:", errorData);
      throw new Error(errorData.message || 'Notion API Error');
    }

    const data = await response.json();
    console.log("Notion APIから正常なデータを受信しました。");

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("--- 関数実行中にエラーが発生しました ---", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};