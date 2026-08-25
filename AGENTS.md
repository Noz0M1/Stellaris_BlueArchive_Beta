# Project Instructions

## External Reference

Stellaris game root:
macOS: `/Users/shigure/Library/Application Support/Steam/steamapps/common/Stellaris`
Windows: `F:\SteamLibrary\steamapps\common\Stellaris\`

Error log:
Windows: `C:\Users\Shigure\Documents\Paradox Interactive\Stellaris\logs\error.log`


Treat the game root as read-only reference material. Do not edit, create, move, or delete files there. When the base game implementation is needed, inspect files under that path and copy the relevant patterns into this mod workspace.

## Project File Structure

The following is a high-level guide to the mod's main script and visual-asset directories. Update it when adding, removing, or substantially repurposing directories or event files.

### `common/`

- `ai_budget/`: Defines AI budget allocations and spending priorities used by this mod.
- `anomalies/`: Defines anomalies and their discovery/event hooks.
- `archaeological_site_types/`: Defines archaeological sites for Decagrammaton, Easter-egg, and Cradle Project storylines.
- `armies/`: Defines regular, emergency/crisis, and origin-specific armies.
- `ascension_perks/`: Defines the mod's ascension perks and restrictions that disable incompatible perks.
- `bombardment_stances/`: Defines custom orbital bombardment stances.
- `buildings/`: Defines branch-office, club, general, fallen-empire, habitat, and other custom buildings.
- `button_effects/`: Contains scripted effects called by custom GUI buttons, including precursor rewards, school philosophies, Angel 24, clubs, and Shittim Chest functions.
- `bypass/`: Defines custom bypass connections used by special links or gateways.
- `casus_belli/`: Defines custom casus belli.
- `colony_types/`: Defines custom colony designations.
- `component_sets/`: Groups ship components into armor, equipment, utility, special-weapon, and weapon sets for display and selection.
- `component_tags/`: Defines tags used to classify and restrict ship components.
- `component_templates/`: Defines Ark ship, utility, protection, equipment, Aris, and other custom ship components and weapons.
- `council_agendas/`: Defines standard and school-idea council agendas.
- `country_customization/`: Defines custom country appearance/customization options.
- `country_limits/`: Defines ownership and ship-count limits.
- `country_types/`: Defines custom country types used by the mod.
- `decisions/`: Defines colony, origin, Cradle Project, and school-idea planetary decisions.
- `defines/`: Overrides selected global game defines for the mod.
- `deposits/`: Defines planetary deposits for Ark, habitat, Kivotos, school-idea, and general content.
- `diplo_phrases/`: Defines diplomatic response phrases for the custom fallen empire.
- `districts/`: Defines Ark, habitat, planet, ringworld, and modified vanilla districts.
- `economic_categories/`: Defines custom economic categories and adjustments to vanilla categories for modifier/cost accounting.
- `edicts/`: Defines leader-renaming and school-idea edicts.
- `event_chains/`: Registers event-chain entries and counters shown in the situation log.
- `game_concepts/`: Defines tooltip encyclopedia concepts, including custom job concepts.
- `game_rules/`: Overrides or extends scripted game-rule checks used by vanilla systems.
- `global_ship_designs/`: Defines globally available preset ship designs for Aris and the custom fallen empire.
- `governments/`: Defines Kivotos and fallen-empire authorities, governments, and civics.
- `graphical_culture/`: Defines the mod's graphical cultures and their asset mappings.
- `inline_scripts/`: Reusable parameterized script fragments for clubs, jobs, leader display/recruitment/recall, and related UI logic.
- `job_tags/`: Defines tags used to group and query custom jobs.
- `megastructures/`: Defines the D-gate, habitat, and industrial megastructures.
- `message_types/`: Defines custom notification/message types.
- `missions/`: Defines mission entries associated with origin progression.
- `name_lists/`: Defines the Schale/Kivotos name list.
- `on_actions/`: Connects mod initialization, periodic checks, leader handling, and other event hooks to game on-actions.
- `opinion_modifiers/`: Defines custom diplomatic opinion modifiers.
- `personalities/`: Defines the custom fallen empire's diplomatic AI personality.
- `planet_classes/`: Defines custom planet classes and their basic properties.
- `policies/`: Defines custom policies and changes/additions related to vanilla policies.
- `pop_categories/`: Defines custom population strata/categories.
- `pop_jobs/`: Defines player-facing and supporting custom jobs.
- `portrait_categories/`: Defines portrait categories shown in empire and species selection.
- `portrait_sets/`: Defines portrait sets and their category/species assignments.
- `prescripted_flags/`: Registers custom empire flag choices.
- `relics/`: Defines custom relics and their activation effects.
- `script_values/`: Defines reusable calculated numeric values.
- `scripted_effects/`: Defines reusable effects for initialization, clubs, crises, event leaders, habitats, and other systems.
- `scripted_loc/`: Defines conditional localization, including leader recruitment greetings and other dynamic text.
- `scripted_modifiers/`: Defines reusable modifier blocks selected through script.
- `scripted_triggers/`: Defines reusable condition checks for event leaders, leader renaming, vanilla integration, and general mod logic.
- `scripted_variables/`: Stores shared scripted constants/variables used by calculations.
- `section_templates/`: Defines ship-section layouts for Ark ships, habitats, fixed designs, and the ship designer.
- `ship_behaviors/`: Defines custom combat behavior patterns for ships.
- `ship_sizes/`: Defines Ark ships, other custom ships, and habitat-like ship sizes.
- `situations/`: Defines situation-log mechanics for ascension, origins, and project progression.
- `solar_system_initializers/`: Defines initial systems for Kivotos, nomad content, and the custom fallen empire.
- `special_projects/`: Defines special projects for crises, the Cradle Project, traditions, and ascension perks.
- `species_archetypes/`: Defines the custom species archetype and its game-rule compatibility.
- `species_classes/`: Defines custom species classes and portrait linkage.
- `species_rights/`: Defines custom purge/species-rights behavior.
- `starbase_buildings/`: Defines custom starbase buildings.
- `starbase_levels/`: Defines Ark ship and custom starbase level progression.
- `starbase_modules/`: Defines Ark ship/custom starbase modules.
- `start_screen_messages/`: Defines origin-specific introductory text shown at game start.
- `static_modifiers/`: Defines persistent modifiers for agendas, clubs, origins, projects, relics, ships, school ideas, and the Shittim system.
- `strategic_resources/`: Defines the mod's strategic resources.
- `technology/`: Defines component, event, industry, and school-idea technologies plus their custom technology category.
- `tradition_categories/`: Defines custom tradition trees/categories.
- `traditions/`: Defines the individual traditions and adoption/finisher effects in those trees.
- `traits/`: Defines leader traits, Schale species traits, habitability traits, and temporary tiered traits.
- `war_goals/`: Defines custom war goals and their surrender/peace behavior.
- `zone_slots/`: Defines zone-slot types and Ark-specific slot rules.
- `zones/`: Defines normal, Ark, habitat, and ringworld planetary zones.

### `events/`

- `00_a_test.txt`: Debug/test events under the `BA_Shittem` namespace, primarily a commission-completion detector and reward dispatcher; not regular narrative content.
- `BA_events_Ascension_perks.txt`: Ascension-perk support events, Gematria archaeology, halo-modification preparation/completion and leader trait maintenance, “Our Story” progression, and planetary ascension handling.
- `BA_events_clubs.txt`: Club creation, club ships/colonization, annual checks, the club communication headquarters UI, room/capacity upgrades, and individual club event/function chains for the Game Development Department, Engineering Club, Veritas, Foreclosure Task Force, Tea Party, Hot Spring Development Department, Festival Operations Department, Xuanwu Promenade, and Publishing Department.
- `BA_events_crisis.txt`: The mid-game Aris crisis: trigger and setup, precursor-country/leader creation, systems and fleets, movement and target selection, bombardment, reinforcement spawning, communications UI, and crisis dialogue/outcome events.
- `BA_events_Easter_egg.txt`: Timed community-member Easter eggs (including MiAzusa and “鞋垫”) plus the Internet Angel/“超天酱” archaeological event sequence.
- `BA_events_leader_rename.txt`: Automatic leader identity, name, portrait, club trait, personal trait, and envoy processing at game start, manual repair, periodic checks, pool entry, recruitment, and level-up; manual global repair uses `BA_rename.1020`.
- `BA_events_origins.txt`: Origin storylines and initialization. It covers the Eden Treaty election/reconstruction branches (Hoshino, Hina, Mika, and Yuuka), halo research follow-ups, and the Kyrie/main origin chain with leader creation, ruin research and cleanup situations, threat removal, armies, rewards, failure/victory, and miscellaneous ending events.
- `BA_events_Precursor.txt`: Precursor/fallen-empire initialization and difficulty, country and system creation, internal/external link activation, system exploration, first contact and communications-station UI, resistance contacts, and associated archaeological sites.
- `BA_events_Projects.txt`: The Cradle Project event chain from initialization through stages A, B, and C: clues, relay excavation, blueprints, shield removal, colonization, archaeology, reconstruction, orbital-weapon versus autonomous-machine branches, periodic/random work events, cleanup, and completion.
- `BA_events_RE.txt`: Minimal placeholder/test event file using namespace `q`, currently containing only event `q.1`.
- `BA_events_Shittem.txt`: Main Shittim Chest controller and UI event file. It initializes shared systems, handles Arona contact, day/night main screens, Finder, Angel 24 shops, school philosophies, leader reserve/customization/outfits, origin commissions and rewards, miscellaneous weapon/megastructure functions, and periodic resource/research checks.

### `gfx/`

- `asset_selectors/`: Asset-selector scripts for choosing room textures.
- `event/`: Event-window illustrations used by story, contact, relic, project, and notification events.
- `event_pictures/`: Additional event and origin illustrations, including the Kivotos origin images.
- `FX/`: Custom rendering shader assets.
- `interface/`: UI textures, icons, backgrounds, logos, buttons, and screen-specific artwork.
  - `BA_UI/`: Large custom UI suites, including club, communication, school-philosophy, leader, and other bespoke screens.
  - `buttons/`: General button textures and retained button-source/backup assets.
  - `council_view/`: Council position icons.
  - `icons/`: Gameplay icons for buildings, civics, technologies, resources, traits, ship components, decisions, modifiers, and related systems.
  - `leaders/`: Leader-recruitment screen artwork.
  - `main/`: Main-menu/game logo textures.
  - `planetview/`: Planet-view and army icons.
  - `progressbars/`: Custom progress-bar textures.
  - `tiles/`: Tradition-category tile artwork.
  - `ui/`: General Shittim/Arona UI elements, backgrounds, message boxes, and club icons.
- `loadingscreens/`: Loading-screen image collection.
- `map/`: Galaxy-map textures, currently the custom colored-star texture.
- `models/`: Meshes, materials, animations, entities, and textures for rendered 3D/2D game objects.
  - `combat_items/`: Models and textures for weapon effects, projectiles, and strike-craft combat items.
  - `planets/`: Planet, star, station, and Ark-related meshes/entities/materials.
  - `portraits/`: Animated portrait meshes, skeleton animations, entity definitions, and character texture collections.
  - `ships/`: Ship sets, stations, turrets, sections, entities, animations, and their textures/materials.
  - `ui/`: Rendered frontend/menu scene assets and backgrounds.
- `particles/`: Particle definitions, effect assets, and texture sequences for weapons, armor, bosses, and PV-style animated effects.
- `personal_story/`: Illustrations used by personal/origin story content.
- `portraits/`: Portrait selection definitions and environmental backdrops used around species/leader portraits.
  - `asset_selectors/`: Leader clothing and room-texture selector scripts.
  - `city_sets/`: City-set, room, and planetary surface/city backdrop textures.
  - `environments/`: Planet-class sky and environment textures.
  - `portraits/`: Portrait-group, event-portrait, main-texture, character-variation, and carefree-character definition files.
- `projectiles/`: Projectile definition scripts linking custom weapons to projectile entities and effects.
- `Shittem_UI/`: Dedicated Shittim Chest interface artwork for the Finder, main screen, animated Arona/Plana portraits, and precursor/reward screens.
