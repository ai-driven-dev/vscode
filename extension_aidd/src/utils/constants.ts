export interface FileTemplate {
  filename: string;
  templatePath: string;
}

export type Software = "cursor" | "windsurf";

export const SOFTWARE_CONFIG: Record<
  Software,
  {
    rules: FileTemplate;
    ignore: FileTemplate;
  }
> = {
  cursor: {
    rules: { filename: ".cursorrules", templatePath: "coding_rules.md" },
    ignore: { filename: ".cursorignore", templatePath: "ignore.md" }
  },
  windsurf: {
    rules: { filename: ".windsurfrules", templatePath: "coding_rules.md" },
    ignore: { filename: ".windsurfignore", templatePath: "ignore.md" }
  }
};

export const EXTENSION_ID = "ai-driven-dev.ai-driven-dev";
