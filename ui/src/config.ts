import configData from '../../config.yaml'

const config = configData as { server: { host: string; port: number } }
export const API_BASE_URL = `http://localhost:${config.server.port}`

