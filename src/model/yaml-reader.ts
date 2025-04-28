import { parseYAML, serializeYAML } from "../util/yaml";


export class YamlReader {
  private data: any;

  constructor(yamlContent: string) {
    this.data = parseYAML(yamlContent);
  }

  /**
   * Acessa um valor no YAML usando notação de ponto (dot notation)
   * Retorna undefined se o caminho não existir
   */
  get(path: string): any {
    return path.split(".").reduce((obj, key) => {
      return obj && typeof obj === "object" ? obj[key] : undefined;
    }, this.data);
  }

  /**
   * Acessa um valor no YAML com um valor padrão caso não exista
   */
  getWithDefault(path: string, defaultValue: any): any {
    const value = this.get(path);
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Verifica se um caminho existe no YAML
   */
  has(path: string): boolean {
    return this.get(path) !== undefined;
  }

  /**
   * Retorna todo o conteúdo do YAML como objeto
   */
  getAll(): any {
    return this.data;
  }

  /**
   * Retorna um novo YamlReader para uma subseção do YAML
   */
  section(path: string): YamlReader {
    const sectionData = this.get(path);
    const temp = new YamlReader("");
    temp.data = sectionData !== undefined ? sectionData : {};
    return temp;
  }

  /**
   * Converte a seção atual para string YAML
   */
  toString(): string {
    return serializeYAML(this.data);
  }
}
