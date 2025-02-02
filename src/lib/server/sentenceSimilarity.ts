import { dot } from '@huggingface/transformers';
import type { Embedding } from '@lib/server/embeddingEndpoints/embeddingEndpoints';
import type { EmbeddingBackendModel } from '@lib/server/embeddingModels';

// see here: https://github.com/nmslib/hnswlib/blob/359b2ba87358224963986f709e593d799064ace6/README.md?plain=1#L34
export function innerProduct(embeddingA: Embedding, embeddingB: Embedding) {
   return 1.0 - dot(embeddingA, embeddingB);
}

export async function getSentenceSimilarity(
   embeddingModel: EmbeddingBackendModel,
   query: string,
   sentences: string[]
): Promise<{ distance: number; embedding: Embedding; idx: number }[]> {
   const inputs = [
      `${embeddingModel.preQuery}${query}`,
      ...sentences.map((sentence) => `${embeddingModel.prePassage}${sentence}`),
   ].filter((input) => input?.length > 0);

   const embeddingEndpoint = await embeddingModel.getEndpoint();
   const output = await embeddingEndpoint({ inputs });

   const queryEmbedding: Embedding = output[0];
   const sentencesEmbeddings: Embedding[] = output.slice(1);

   return sentencesEmbeddings.map((sentenceEmbedding, idx) => ({
      distance: innerProduct(queryEmbedding, sentenceEmbedding),
      embedding: sentenceEmbedding,
      idx,
   }));
}
