import type { GrammarSourceDefinition, GrammarSourceSentence } from "./types";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { SEED_VOCABULARY } from "@/content/seed/vocabulary";
import { SEED_EXERCISES_MAP } from "@/content/seed/exercises";

class GrammarSourcesRegistry {
  private sources: Map<string, GrammarSourceDefinition> = new Map();

  constructor() {
    this.registerDefaultSources();
  }

  register(source: GrammarSourceDefinition): void {
    this.sources.set(source.id, source);
  }

  get(id: string): GrammarSourceDefinition | undefined {
    return this.sources.get(id);
  }

  list(): GrammarSourceDefinition[] {
    return Array.from(this.sources.values());
  }

  private registerDefaultSources(): void {
    // 1. Conversation Dialogues Source
    this.register({
      id: "conversations",
      title: "Conversation Turns",
      listSentences: (scenarioSlug?: string): GrammarSourceSentence[] => {
        const sentences: GrammarSourceSentence[] = [];
        const entries = scenarioSlug
          ? Object.entries(SEED_DIALOGUES).filter(([slug]) => slug === scenarioSlug)
          : Object.entries(SEED_DIALOGUES);

        for (const [slug, versions] of entries) {
          for (const version of versions) {
            for (const line of version.lines) {
              sentences.push({
                id: `${slug}/${version.versionId}/${line.id}`,
                text: line.englishText,
                lang: "en",
              });
            }
          }
        }
        return sentences;
      },
    });

    // 2. Vocabulary Examples Source
    this.register({
      id: "vocabulary",
      title: "Vocabulary Examples",
      listSentences: (): GrammarSourceSentence[] => {
        return Object.entries(SEED_VOCABULARY).map(([lemma, item]) => ({
          id: `vocab/${lemma}`,
          text: item.exampleSentence,
          lang: "en",
        }));
      },
    });

    // 3. Practice Exercises Source
    this.register({
      id: "practice",
      title: "Practice Prompts",
      listSentences: (): GrammarSourceSentence[] => {
        const sentences: GrammarSourceSentence[] = [];
        for (const [stepKey, exerciseSet] of Object.entries(SEED_EXERCISES_MAP)) {
          if (exerciseSet.completeLines) {
            for (const cl of exerciseSet.completeLines) {
              sentences.push({
                id: `practice/${stepKey}/${cl.id}`,
                text: cl.fullSentence,
                lang: "en",
              });
            }
          }
          if (exerciseSet.listeningQuizzes) {
            for (const lq of exerciseSet.listeningQuizzes) {
              if (lq.audioPrompt) {
                sentences.push({
                  id: `practice/${stepKey}/${lq.id}`,
                  text: lq.audioPrompt,
                  lang: "en",
                });
              }
            }
          }
        }
        return sentences;
      },
    });
  }
}

export const sourcesRegistry = new GrammarSourcesRegistry();

export function registerSource(source: GrammarSourceDefinition): void {
  sourcesRegistry.register(source);
}

export function getSource(id: string): GrammarSourceDefinition | undefined {
  return sourcesRegistry.get(id);
}

export function listSources(): GrammarSourceDefinition[] {
  return sourcesRegistry.list();
}
