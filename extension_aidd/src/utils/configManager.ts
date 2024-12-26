import * as vscode from "vscode";

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private configCache: Map<string, any> = new Map();
  private readonly cacheTimeout = 5000; // 5 seconds cache
  private disposables: vscode.Disposable[] = [];

  private constructor() {}

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  async initialize() {
    try {
      // Préchargement des configurations essentielles
      await this.preloadConfigurations();

      // Observer les changements de configuration
      this.disposables.push(
        vscode.workspace.onDidChangeConfiguration(async (e) => {
          if (e.affectsConfiguration("ai-driven-dev")) {
            try {
              await this.preloadConfigurations();
            } catch (error) {
              console.error("Error reloading configurations:", error);
            }
          }
        })
      );
    } catch (error) {
      console.error("Error initializing ConfigurationManager:", error);
      throw error;
    }
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
    this.configCache.clear();
  }

  private async preloadConfigurations() {
    try {
      const config = vscode.workspace.getConfiguration("ai-driven-dev");
      const entries = config.inspect("");

      if (entries?.globalValue) {
        Object.entries(entries.globalValue).forEach(([key, value]) => {
          this.setCacheValue(key, value);
        });
      }
    } catch (error) {
      console.error("Error preloading configurations:", error);
      throw error;
    }
  }

  private setCacheValue(key: string, value: any) {
    if (key && value !== undefined) {
      this.configCache.set(key, {
        value,
        timestamp: Date.now()
      });
    }
  }

  private isCacheValid(key: string): boolean {
    const cached = this.configCache.get(key);
    if (!cached) return false;

    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  async getConfiguration<T>(key: string, defaultValue?: T): Promise<T> {
    try {
      if (this.isCacheValid(key)) {
        return this.configCache.get(key).value;
      }

      const config = vscode.workspace.getConfiguration("ai-driven-dev");
      const value = config.get<T>(key, defaultValue as T);
      this.setCacheValue(key, value);
      return value;
    } catch (error) {
      console.error(`Error getting configuration for key ${key}:`, error);
      return defaultValue as T;
    }
  }

  async updateConfiguration(
    key: string,
    value: any,
    target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global
  ) {
    try {
      const config = vscode.workspace.getConfiguration("ai-driven-dev");
      await config.update(key, value, target);
      this.setCacheValue(key, value);
    } catch (error) {
      console.error(`Error updating configuration for key ${key}:`, error);
      throw error;
    }
  }
}

export const configManager = ConfigurationManager.getInstance();
