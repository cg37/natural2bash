import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";

const CONFIG_DIR = join(homedir(), ".config", "natural2bash");
const CONFIG_PATH = join(CONFIG_DIR, "config.json");

function ensureConfigDir() {
    if (!existsSync(CONFIG_DIR)) {
        mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

function load() {
    try {
        if (existsSync(CONFIG_PATH)) {
            return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
        }
    } catch {
        // 配置文件损坏时忽略
    }
    return {};
}

function save(config) {
    ensureConfigDir();
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

export function getApiKeyFromConfig() {
    const config = load();
    return config.apiKey || null;
}

export function setApiKey(apiKey) {
    const config = load();
    config.apiKey = apiKey;
    save(config);
}

export function getConfigPath() {
    return CONFIG_PATH;
}
