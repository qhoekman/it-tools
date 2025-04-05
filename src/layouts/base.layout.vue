<script lang="ts" setup>
import { NIcon, useThemeVars } from 'naive-ui';

import { RouterLink } from 'vue-router';
import { Heart, Home2, Menu2 } from '@vicons/tabler';

import { storeToRefs } from 'pinia';
import HeroGradient from '../assets/hero-gradient.svg?component';
import MenuLayout from '../components/MenuLayout.vue';
import NavbarButtons from '../components/NavbarButtons.vue';
import { useStyleStore } from '@/stores/style.store';
import { config } from '@/config';
import type { ToolCategory } from '@/tools/tools.types';
import { useToolStore } from '@/tools/tools.store';
import { useTracker } from '@/modules/tracker/tracker.services';
import CollapsibleToolMenu from '@/components/CollapsibleToolMenu.vue';

const themeVars = useThemeVars();
const styleStore = useStyleStore();
const version = config.app.version;
const commitSha = config.app.lastCommitSha.slice(0, 7);

const { tracker } = useTracker();
const { t } = useI18n();

const toolStore = useToolStore();
const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);

const tools = computed<ToolCategory[]>(() => [
  ...(favoriteTools.value.length > 0
    ? [{ name: t('tools.categories.favorite-tools'), components: favoriteTools.value }]
    : []),
  ...toolsByCategory.value,
]);
</script>

<template>
  <MenuLayout class="menu-layout" :class="{ isSmallScreen: styleStore.isSmallScreen }">
    <template #sider>
      <RouterLink to="/" class="hero-wrapper">
        <HeroGradient class="gradient" />
        <div class="text-wrapper">
          <div class="logo">
            <svg viewBox="0 0 40 44" class="css-1aap76z">
              <path
                d="M36.2876 30.6607C41.7036 21.4895 40.0784 16.7241 38.3465 11.8434C36.4748 7.65523 33.2129 4.23644 29.109 2.16155C25.005 0.08665 20.3091 -0.517884 15.8104 0.449536C11.3117 1.41695 7.28443 3.89736 4.40533 7.47393C1.52622 11.0505 -0.0292106 15.5052 0.000415516 20.0895C0.0300416 24.6738 1.64292 29.1082 4.56801 32.6475C7.49311 36.1869 11.5521 38.6154 16.0629 39.5251C20.5738 40.4347 27.3364 38.183 31.4132 36.0556L26.7001 32.6264C23.7799 34.1502 20.4221 34.6263 17.191 33.9747C13.9599 33.3232 11.0524 31.5836 8.9572 29.0484C6.86196 26.5131 5.70666 23.3368 5.68544 20.053C5.66421 16.7693 6.77837 13.5784 8.84067 11.0165C10.903 8.45463 13.7877 6.67792 17.0101 5.98495C20.2325 5.29199 23.5962 5.72502 26.5359 7.21127C29.4755 8.69751 31.812 11.1464 33.1527 14.1464C34.4934 17.1463 36.8292 23.6474 33.1527 27.9633H35.746L36.2876 30.6607Z"
                fill="currentColor"
              />
              <path
                d="M39.2988 43.7163C39.2988 43.7163 38.129 42.8639 36.4392 41.5584C35.5943 40.8786 34.6086 40.1017 33.5795 39.2278C32.5505 38.3538 31.4889 37.4151 30.4166 36.4764C29.3442 35.5377 28.0769 34.7393 27.167 33.7682C26.362 32.8274 25.7213 31.7588 25.2714 30.6068C25.0649 30.1274 24.8947 29.6333 24.7623 29.1286C24.6416 28.7215 24.5476 28.307 24.4806 27.8878C24.4108 27.4959 24.3745 27.0989 24.3723 26.7009L24.7839 26.3448C25.1802 26.4101 25.5711 26.5039 25.9538 26.6254C26.3589 26.7465 26.7567 26.8906 27.1453 27.057C27.6269 27.2621 28.0938 27.5 28.5426 27.7691C29.6243 28.3752 30.5979 29.1554 31.4239 30.0781C32.2688 31.1031 32.8538 32.4626 33.6662 33.6387C34.4786 34.8148 35.2693 36.0016 35.9734 37.1454C36.6775 38.2891 37.3382 39.3033 37.9015 40.2744C38.9847 42.1302 39.6996 43.4034 39.6996 43.4034L39.2988 43.7163Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="divider" />
          <div class="subtitle">Tools</div>
        </div>
      </RouterLink>

      <div class="sider-content">
        <div v-if="styleStore.isSmallScreen" flex flex-col items-center>
          <locale-selector w="90%" />

          <div flex justify-center>
            <NavbarButtons />
          </div>
        </div>

        <CollapsibleToolMenu :tools-by-category="tools" />

        <div class="footer">
          <div>
            Tools

            <c-link target="_blank" rel="noopener" :href="`https://github.com/CorentinTh/it-tools/tree/v${version}`">
              v{{ version }}
            </c-link>

            <template v-if="commitSha && commitSha.length > 0">
              -
              <c-link
                target="_blank"
                rel="noopener"
                type="primary"
                :href="`https://github.com/CorentinTh/it-tools/tree/${commitSha}`"
              >
                {{ commitSha }}
              </c-link>
            </template>
          </div>
          <div>© {{ new Date().getFullYear() }}</div>
        </div>
      </div>
    </template>

    <template #content>
      <div flex items-center justify-center gap-2>
        <c-button
          circle
          variant="text"
          :aria-label="$t('home.toggleMenu')"
          @click="styleStore.isMenuCollapsed = !styleStore.isMenuCollapsed"
        >
          <NIcon size="25" :component="Menu2" />
        </c-button>

        <c-tooltip :tooltip="$t('home.home')" position="bottom">
          <c-button to="/" circle variant="text" :aria-label="$t('home.home')">
            <NIcon size="25" :component="Home2" />
          </c-button>
        </c-tooltip>

        <c-tooltip :tooltip="$t('home.uiLib')" position="bottom">
          <c-button
            v-if="config.app.env === 'development'"
            to="/c-lib"
            circle
            variant="text"
            :aria-label="$t('home.uiLib')"
          >
            <icon-mdi:brush-variant text-20px />
          </c-button>
        </c-tooltip>

        <command-palette />

        <locale-selector v-if="!styleStore.isSmallScreen" />

        <div>
          <NavbarButtons v-if="!styleStore.isSmallScreen" />
        </div>
      </div>
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
// ::v-deep(.n-layout-scroll-container) {
//     @percent: 4%;
//     @position: 25px;
//     @size: 50px;
//     @color: #eeeeee25;
//     background-image: radial-gradient(@color @percent, transparent @percent),
//         radial-gradient(@color @percent, transparent @percent);
//     background-position: 0 0, @position @position;
//     background-size: @size @size;
// }

.support-button {
  background: rgb(37, 99, 108);
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
  color: #fff !important;
  transition: padding ease 0.2s !important;

  &:hover {
    color: #fff;
    padding-left: 30px;
    padding-right: 30px;
  }
}

.footer {
  text-align: center;
  color: #838587;
  margin-top: 20px;
  padding: 20px 0;
}

.sider-content {
  padding-top: 160px;
  padding-bottom: 200px;
}

.hero-wrapper {
  position: absolute;
  display: block;
  left: 0;
  width: 100%;
  z-index: 10;
  overflow: hidden;

  .gradient {
    margin-top: -65px;
  }

  .text-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 16px;
    color: #fff;

    .title {
      font-size: 25px;
      font-weight: 600;
    }

    .logo {
      width: 40px;
      height: 44px;
    }

    .divider {
      width: 50px;
      height: 2px;
      border-radius: 4px;
      background-color: v-bind('themeVars.primaryColor');
      margin: 0 auto 5px;
    }

    .subtitle {
      font-size: 16px;
    }
  }
}
</style>
