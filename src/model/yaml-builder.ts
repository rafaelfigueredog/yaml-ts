/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    setByPath,
    deleteByPath,
    parseYAML,
    deepClone,
    serializeYAML,
  } from "../util/yaml";
  
  interface Operation {
    apply(target: Record<string, any>): Record<string, any>;
  }
  
  class EditOperation implements Operation {
    constructor(private path: string, private value: any) {}
    apply(target: Record<string, any>): Record<string, any> {
      const keys = this.path.split(".");
      return setByPath(target, keys, this.value);
    }
  }
  
  class RemoveOperation implements Operation {
    constructor(private path: string) {}
    apply(target: Record<string, any>): Record<string, any> {
      const keys = this.path.split(".");
      return deleteByPath(target, keys);
    }
  }
  
  class ExtractOperation implements Operation {
    constructor(private pathsToExtract: string[]) {}
  
    apply(target: Record<string, any>): Record<string, any> {
      let result: Record<string, any> = {};
  
      for (const path of this.pathsToExtract) {
        const keys = path.split(".");
        // 1. percorre o objeto original para encontrar o valor
        let value: any = target;
        for (const key of keys) {
          if (value == null || typeof value !== "object" || !(key in value)) {
            value = undefined;
            break;
          }
          value = value[key];
        }
        // 2. se encontrou, faz o “setByPath” em result
        if (value !== undefined) {
          result = setByPath(result, keys, value);
        }
      }
  
      return result;
    }
  }
  
  export class YamlBuilder {
    private operations: Operation[] = [];
  
    constructor(private yaml: string = "") {}
  
    edit(path: string, value: any): this {
      this.operations.push(new EditOperation(path, value));
      return this;
    }
  
    extract(paths: string[]): this {
      this.operations.push(new ExtractOperation(paths));
      return this;
    }
  
    remove(path: string): this {
      this.operations.push(new RemoveOperation(path));
      return this;
    }
  
    /**
     * Parse → clone → aplica operações → retorna objeto
     */
    toObject(): Record<string, any> {
      // 1. parse YAML em objeto JS
      const Yaml = parseYAML<Record<string, any>>(this.yaml);
  
      // 2. para evitar mutações no objeto original
      let clone = deepClone(Yaml);
  
      // 3. aplica cada comando
      for (const op of this.operations) {
        clone = op.apply(clone);
      }
  
      return clone;
    }
  
    /**
     * Parse → clone → aplica operações → retorna YAML
     */
    toString(): string {
      // 1. parse YAML em objeto JS
      const Yaml = parseYAML<Record<string, any>>(this.yaml);
  
      // 2. para evitar mutações no objeto original
      let clone = deepClone(Yaml);
  
      // 3. aplica cada comando
      for (const op of this.operations) {
        clone = op.apply(clone);
      }
      // 4. serializa de volta para YAML
      return serializeYAML(clone);
    }
  }
  