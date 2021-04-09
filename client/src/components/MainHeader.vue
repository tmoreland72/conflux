<template>
  <q-header
    class="q-pa-md row justify-between items-center q-gutter-sm bg-dark text-accent"
    style="min-height: 64px;"
  >
    <q-toolbar>
      <q-toolbar-title>
        <div class="row items-center">
          <q-btn flat round :to="{ name: 'home' }">
            <q-avatar color="primary" size="56px">
              <q-icon :name="icons.conflux" color="white" size="md" />
            </q-avatar>
          </q-btn>
          <span class="q-ml-md text-h4 text-weight-light">Conflux</span>
        </div>
      </q-toolbar-title>

      <div class="row q-gutter-xs">
        <algolia-search />
        <!-- <q-btn color="grey-5" :icon="icons.bookmarks" flat round /> -->

        <!-- <q-btn color="grey-5" :icon="icons.notifications" flat round>
               <q-menu>
                  <div class="q-pa-lg" style="min-width: 300px;">
                     <div class="text-h6 text-accent">Notifications</div>
                     <q-space />
                     <q-toggle color="grey-5" v-model="muteNotifications">Mute Notifications</q-toggle>

                     <q-separator class="q-my-lg" />

                     <template v-if="!notifications.length">
                        <div class="text-caption">No notifications right now</div>
                     </template>
                  </div>
               </q-menu>
            </q-btn> -->

        <q-btn color="grey-5" flat :icon="icons.help" round>
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column q-gutter-sm">
                <div class="text-overline">Help</div>
                <q-btn
                  align="left"
                  flat
                  color="accent"
                  label="Online Help"
                  no-caps
                />
                <q-btn
                  align="left"
                  flat
                  color="accent"
                  label="What's New"
                  no-caps
                />
                <q-btn
                  align="left"
                  flat
                  color="accent"
                  label="About Conflux"
                  no-caps
                />

                <q-separator />

                <div class="text-overline">Legal</div>
                <q-btn
                  align="left"
                  flat
                  color="accent"
                  label="Terms of Service"
                  no-caps
                />
                <q-btn
                  align="left"
                  flat
                  color="accent"
                  label="Privacy Policy"
                  no-caps
                />
              </div>
            </div>
          </q-menu>
        </q-btn>

        <q-btn color="grey-5" flat :icon="icons.account" round>
          <profile-menu :profile="profile" />
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { storage } from "boot/storage";
import Core from "src/mixins/Core";

export default {
  name: "MainHeader",

  data() {
    return {
      muteNotifications: false,
      notifications: [],
      search: "",
    };
  },

  computed: {
    profile() {
      return storage.getItem("profile");
    },
  },

  mixins: [Core],

  components: {
    AlgoliaSearch: () => import("components/Search.vue"),
    ProfileMenu: () => import("components/ProfileMenu.vue"),
  },
};
</script>

<style></style>
