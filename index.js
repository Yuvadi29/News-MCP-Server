import {
  McpServer,
  ResourceTemplate
} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.API_KEY;

// Create an MCP server
const server = new McpServer({
  name: 'Weather Data',
  version: '1.0.0'
})

async function getWhetherDataByCityName (city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    )

    if (!response) return { whether: null, error: 'city not found' }
    return response?.data
  } catch (error) {
    console.log(error)
  }
}

// Tool
server.tool(
  'getWeatherData',
  {
    city: z.string()
  },
  async ({ city }) => ({
    content: [
      {
        type: 'text',
        text: JSON.stringify(await getWhetherDataByCityName(city))
      }
    ]
  })
)

async function init () {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

init()
