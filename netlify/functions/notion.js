export const handler = async (event) => {
  const { databaseId, filter } = JSON.parse(event.body);
  const NOTION_API_KEY = process.env.NOTION_API_KEY;
  const NOTION_API_ENDPOINT = `https://api.notion.com/v1/databases/${databaseId}/query`;

  try {
    const response = await fetch(NOTION_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({ filter: filter })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.message })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
