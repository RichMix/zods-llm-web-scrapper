import type { ObjectId } from 'mongodb';

import type { HeaderElement } from '@lib/server/websearch/markdown/types';

import type { Conversation } from './Conversation';
import { CountryCode } from './Country';
import { LanguageCode } from './Language';
import type { Timestamps } from './Timestamps';

export interface WebSearch extends Timestamps {
   _id?: ObjectId;
   convId?: Conversation['_id'];

   prompt: string;

   searchQuery: string;
   results: WebSearchSource[];
   relevantData?: string;
   contextSources: WebSearchUsedSource[];
}

export interface WebSearchSourceRelevantData {
   title: string;
   content: string;
}

export interface WebSearchSource {
   title?: string;
   link: string;
}

export interface WebSearchResult {
   sources: WebSearchSource[];
   relevantData: WebSearchSourceRelevantData[];
}

export interface WebSearchScrapedSource extends WebSearchSource {
   page: WebSearchPage;
}
export interface WebSearchPage {
   title: string;
   siteName?: string;
   author?: string;
   description?: string;
   createdAt?: string;
   modifiedAt?: string;
   markdownTree: HeaderElement;
}

export interface WebSearchUsedSource extends WebSearchScrapedSource {
   context: string;
}

export type WebSearchMessageSources = {
   type: 'sources';
   sources: WebSearchSource[];
};

// eslint-disable-next-line no-shadow
export enum WebSearchProvider {
   GOOGLE = 'Google',
   YOU = 'You.com',
   SEARXNG = 'SearXNG',
   BING = 'Bing',
}

export interface WebSearchQuery {
   query: string;
   languageCode?: LanguageCode;
   countryCode?: CountryCode;
}
