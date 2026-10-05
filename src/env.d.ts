/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="@mercuryworkshop/scramjet" />
/// <reference types="@mercuryworkshop/scramjet-controller" />
import type { BareCompatibleClient } from '@mercuryworkshop/proxy-transports';
import type { Controller } from '@mercuryworkshop/scramjet-controller';

declare global {
  interface Window {
    client: BareCompatibleClient;
  	controller: Controller;
  }
}
