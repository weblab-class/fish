# Diff Details

Date : 2024-01-31 10:09:48

Directory /Users/kennethchap/Documents/GitHub/fish

Total : 281 files,  500 codes, 41 comments, 79 blanks, all 620 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.json](/.eslintrc.json) | JSON | 3 | 0 | 1 | 4 |
| [.prettierrc](/.prettierrc) | JSON | 5 | 0 | 0 | 5 |
| [README.md](/README.md) | Markdown | 44 | 0 | 11 | 55 |
| [app.d.ts](/app.d.ts) | TypeScript | 7 | 1 | 0 | 8 |
| [app/(errors)/error/page.tsx](/app/(errors)/error/page.tsx) | TypeScript JSX | 50 | 0 | 5 | 55 |
| [app/(errors)/no-duplicate-tabs/page.tsx](/app/(errors)/no-duplicate-tabs/page.tsx) | TypeScript JSX | 6 | 0 | 2 | 8 |
| [app/(protected)/game/[username]/page.tsx](/app/(protected)/game/%5Busername%5D/page.tsx) | TypeScript JSX | 1,068 | 162 | 144 | 1,374 |
| [app/(protected)/home/[username]/page.tsx](/app/(protected)/home/%5Busername%5D/page.tsx) | TypeScript JSX | 525 | 81 | 59 | 665 |
| [app/(protected)/layout.tsx](/app/(protected)/layout.tsx) | TypeScript JSX | 28 | 7 | 7 | 42 |
| [app/TitlePageLogin.tsx](/app/TitlePageLogin.tsx) | TypeScript JSX | 247 | 13 | 9 | 269 |
| [app/TitlePageOnboarding.tsx](/app/TitlePageOnboarding.tsx) | TypeScript JSX | 266 | 24 | 23 | 313 |
| [app/api/auth/login/google/callback/route.ts](/app/api/auth/login/google/callback/route.ts) | TypeScript | 59 | 4 | 12 | 75 |
| [app/api/auth/login/google/route.ts](/app/api/auth/login/google/route.ts) | TypeScript | 18 | 3 | 4 | 25 |
| [app/api/auth/logout/route.ts](/app/api/auth/logout/route.ts) | TypeScript | 18 | 3 | 8 | 29 |
| [app/api/db/player-room/get/route.ts](/app/api/db/player-room/get/route.ts) | TypeScript | 9 | 0 | 4 | 13 |
| [app/api/db/player-room/update/route.ts](/app/api/db/player-room/update/route.ts) | TypeScript | 14 | 0 | 4 | 18 |
| [app/api/db/player/create/route.ts](/app/api/db/player/create/route.ts) | TypeScript | 24 | 0 | 5 | 29 |
| [app/api/db/player/get-by-username/route.ts](/app/api/db/player/get-by-username/route.ts) | TypeScript | 13 | 0 | 5 | 18 |
| [app/api/db/player/get/route.ts](/app/api/db/player/get/route.ts) | TypeScript | 9 | 0 | 4 | 13 |
| [app/api/db/player/update/route.ts](/app/api/db/player/update/route.ts) | TypeScript | 11 | 0 | 4 | 15 |
| [app/api/db/sentence-symphony/create/route.ts](/app/api/db/sentence-symphony/create/route.ts) | TypeScript | 29 | 0 | 4 | 33 |
| [app/api/db/sentence-symphony/delete/route.ts](/app/api/db/sentence-symphony/delete/route.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [app/api/db/sentence-symphony/get/route.ts](/app/api/db/sentence-symphony/get/route.ts) | TypeScript | 9 | 0 | 4 | 13 |
| [app/api/db/sentence-symphony/update/route.ts](/app/api/db/sentence-symphony/update/route.ts) | TypeScript | 14 | 0 | 4 | 18 |
| [app/api/pusher/auth/route.ts](/app/api/pusher/auth/route.ts) | TypeScript | 155 | 30 | 21 | 206 |
| [app/api/pusher/home/changeScene/route.ts](/app/api/pusher/home/changeScene/route.ts) | TypeScript | 13 | 0 | 5 | 18 |
| [app/api/pusher/home/chatLog/route.ts](/app/api/pusher/home/chatLog/route.ts) | TypeScript | 15 | 0 | 4 | 19 |
| [app/api/pusher/home/sendPlayerData/route.ts](/app/api/pusher/home/sendPlayerData/route.ts) | TypeScript | 18 | 0 | 5 | 23 |
| [app/api/pusher/home/updatePlayers/route.ts](/app/api/pusher/home/updatePlayers/route.ts) | TypeScript | 12 | 0 | 9 | 21 |
| [app/api/pusher/shared/redirect/route.ts](/app/api/pusher/shared/redirect/route.ts) | TypeScript | 31 | 1 | 8 | 40 |
| [app/api/pusher/symphony/gameRoomCreated/route.ts](/app/api/pusher/symphony/gameRoomCreated/route.ts) | TypeScript | 12 | 0 | 12 | 24 |
| [app/api/pusher/symphony/gameTimer/route.ts](/app/api/pusher/symphony/gameTimer/route.ts) | TypeScript | 29 | 1 | 18 | 48 |
| [app/api/pusher/symphony/generatePrompt/route.ts](/app/api/pusher/symphony/generatePrompt/route.ts) | TypeScript | 13 | 0 | 11 | 24 |
| [app/api/pusher/symphony/newMessage/route.ts](/app/api/pusher/symphony/newMessage/route.ts) | TypeScript | 15 | 0 | 5 | 20 |
| [app/api/pusher/symphony/newRound/route.ts](/app/api/pusher/symphony/newRound/route.ts) | TypeScript | 12 | 2 | 11 | 25 |
| [app/api/pusher/symphony/roundChange/route.ts](/app/api/pusher/symphony/roundChange/route.ts) | TypeScript | 26 | 0 | 12 | 38 |
| [app/api/pusher/symphony/submitResponse/route.ts](/app/api/pusher/symphony/submitResponse/route.ts) | TypeScript | 35 | 4 | 18 | 57 |
| [app/api/pusher/symphony/submittedResponse/route.ts](/app/api/pusher/symphony/submittedResponse/route.ts) | TypeScript | 20 | 5 | 14 | 39 |
| [app/api/pusher/symphony/topContributor/route.ts](/app/api/pusher/symphony/topContributor/route.ts) | TypeScript | 13 | 0 | 10 | 23 |
| [app/api/pusher/symphony/updateContributions/route.ts](/app/api/pusher/symphony/updateContributions/route.ts) | TypeScript | 21 | 0 | 10 | 31 |
| [app/api/pusher/symphony/updateData/route.ts](/app/api/pusher/symphony/updateData/route.ts) | TypeScript | 15 | 0 | 10 | 25 |
| [app/api/pusher/symphony/updateResponses/route.ts](/app/api/pusher/symphony/updateResponses/route.ts) | TypeScript | 13 | 0 | 11 | 24 |
| [app/api/pusher/symphony/updateStory/route.ts](/app/api/pusher/symphony/updateStory/route.ts) | TypeScript | 12 | 0 | 11 | 23 |
| [app/globals.css](/app/globals.css) | CSS | 9 | 1 | 3 | 13 |
| [app/layout.tsx](/app/layout.tsx) | TypeScript JSX | 26 | 0 | 4 | 30 |
| [app/not-found.tsx](/app/not-found.tsx) | TypeScript JSX | 10 | 0 | 2 | 12 |
| [app/page.tsx](/app/page.tsx) | TypeScript JSX | 29 | 4 | 4 | 37 |
| [components/ChatLogPhaser.tsx](/components/ChatLogPhaser.tsx) | TypeScript JSX | 193 | 6 | 13 | 212 |
| [components/DrawingCanvas.tsx](/components/DrawingCanvas.tsx) | TypeScript JSX | 107 | 26 | 13 | 146 |
| [components/EaselPopup.tsx](/components/EaselPopup.tsx) | TypeScript JSX | 27 | 0 | 5 | 32 |
| [components/GamePopup.tsx](/components/GamePopup.tsx) | TypeScript JSX | 120 | 2 | 17 | 139 |
| [components/HelpPopup.tsx](/components/HelpPopup.tsx) | TypeScript JSX | 201 | 8 | 9 | 218 |
| [components/InvitePopup.tsx](/components/InvitePopup.tsx) | TypeScript JSX | 243 | 5 | 25 | 273 |
| [components/Mail.tsx](/components/Mail.tsx) | TypeScript JSX | 94 | 6 | 8 | 108 |
| [components/MailPopup.tsx](/components/MailPopup.tsx) | TypeScript JSX | 74 | 1 | 9 | 84 |
| [components/ReadMailPopup.tsx](/components/ReadMailPopup.tsx) | TypeScript JSX | 71 | 0 | 11 | 82 |
| [components/SendMailPopup.tsx](/components/SendMailPopup.tsx) | TypeScript JSX | 108 | 4 | 8 | 120 |
| [components/stopwatch.tsx](/components/stopwatch.tsx) | TypeScript JSX | 54 | 2 | 5 | 61 |
| [components/symphony/ChatLog.tsx](/components/symphony/ChatLog.tsx) | TypeScript JSX | 157 | 22 | 12 | 191 |
| [components/symphony/PieScore.tsx](/components/symphony/PieScore.tsx) | TypeScript JSX | 63 | 2 | 6 | 71 |
| [components/symphony/ResponseCard.tsx](/components/symphony/ResponseCard.tsx) | TypeScript JSX | 95 | 13 | 10 | 118 |
| [components/symphony/VoteCount.tsx](/components/symphony/VoteCount.tsx) | TypeScript JSX | 32 | 0 | 3 | 35 |
| [components/timer.tsx](/components/timer.tsx) | TypeScript JSX | 60 | 2 | 5 | 67 |
| [environment.d.ts](/environment.d.ts) | TypeScript | 13 | 0 | 2 | 15 |
| [global.d.ts](/global.d.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [next.config.js](/next.config.js) | JavaScript | 8 | 2 | 3 | 13 |
| [package-lock.json](/package-lock.json) | JSON | 5,744 | 0 | 1 | 5,745 |
| [package.json](/package.json) | JSON | 51 | 0 | 1 | 52 |
| [phaser/Game.tsx](/phaser/Game.tsx) | TypeScript JSX | 83 | 3 | 11 | 97 |
| [phaser/functions.ts](/phaser/functions.ts) | TypeScript | 106 | 35 | 19 | 160 |
| [phaser/scenes/exterior.ts](/phaser/scenes/exterior.ts) | TypeScript | 311 | 30 | 74 | 415 |
| [phaser/scenes/interior.ts](/phaser/scenes/interior.ts) | TypeScript | 326 | 147 | 86 | 559 |
| [phaser/scenes/studyroom.ts](/phaser/scenes/studyroom.ts) | TypeScript | 96 | 4 | 65 | 165 |
| [phaser/settings/consts.ts](/phaser/settings/consts.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [phaser/settings/functions.ts](/phaser/settings/functions.ts) | TypeScript | 19 | 1 | 1 | 21 |
| [phaser/stores/index.ts](/phaser/stores/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [phaser/stores/types.ts](/phaser/stores/types.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [phaser/stores/useHomeStore.ts](/phaser/stores/useHomeStore.ts) | TypeScript | 70 | 4 | 8 | 82 |
| [phaser/stores/useMultiplayerStore.ts](/phaser/stores/useMultiplayerStore.ts) | TypeScript | 144 | 9 | 18 | 171 |
| [phaser/types/IChangeSceneParams.ts](/phaser/types/IChangeSceneParams.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [phaser/types/IRedirectParams.ts](/phaser/types/IRedirectParams.ts) | TypeScript | 5 | 0 | 0 | 5 |
| [phaser/types/ISendPlayerDataParams.ts](/phaser/types/ISendPlayerDataParams.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [phaser/types/index.ts](/phaser/types/index.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [phaser/types/player.ts](/phaser/types/player.ts) | TypeScript | 9 | 0 | 1 | 10 |
| [postcss.config.js](/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [public/backgrounds/background.json](/public/backgrounds/background.json) | JSON | 41 | 0 | 0 | 41 |
| [public/backgrounds/interior.json](/public/backgrounds/interior.json) | JSON | 41 | 0 | 1 | 42 |
| [services/lucia/LuciaSessionProvider.tsx](/services/lucia/LuciaSessionProvider.tsx) | TypeScript JSX | 27 | 10 | 7 | 44 |
| [services/lucia/functions.ts](/services/lucia/functions.ts) | TypeScript | 22 | 12 | 11 | 45 |
| [services/lucia/index.ts](/services/lucia/index.ts) | TypeScript | 28 | 4 | 6 | 38 |
| [services/lucia/models.ts](/services/lucia/models.ts) | TypeScript | 33 | 1 | 11 | 45 |
| [services/mongo/index.ts](/services/mongo/index.ts) | TypeScript | 1 | 4 | 2 | 7 |
| [services/mongo/models/Player.ts](/services/mongo/models/Player.ts) | TypeScript | 57 | 0 | 15 | 72 |
| [services/mongo/models/PlayerRoom.ts](/services/mongo/models/PlayerRoom.ts) | TypeScript | 48 | 0 | 14 | 62 |
| [services/mongo/models/game/BaseGameRoom.ts](/services/mongo/models/game/BaseGameRoom.ts) | TypeScript | 22 | 0 | 7 | 29 |
| [services/mongo/models/game/SentenceSymphonyGameRoom.ts](/services/mongo/models/game/SentenceSymphonyGameRoom.ts) | TypeScript | 67 | 0 | 18 | 85 |
| [services/mongo/models/game/index.ts](/services/mongo/models/game/index.ts) | TypeScript | 2 | 4 | 2 | 8 |
| [services/mongo/models/index.ts](/services/mongo/models/index.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [services/mongo/models/types.ts](/services/mongo/models/types.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [services/mongo/mongoose.ts](/services/mongo/mongoose.ts) | TypeScript | 24 | 7 | 7 | 38 |
| [services/pusher/client.ts](/services/pusher/client.ts) | TypeScript | 14 | 1 | 2 | 17 |
| [services/pusher/index.ts](/services/pusher/index.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [services/pusher/server.ts](/services/pusher/server.ts) | TypeScript | 8 | 0 | 1 | 9 |
| [services/pusher/types.ts](/services/pusher/types.ts) | TypeScript | 7 | 1 | 1 | 9 |
| [services/react-query/ReactQueryHydrate.tsx](/services/react-query/ReactQueryHydrate.tsx) | TypeScript JSX | 5 | 0 | 2 | 7 |
| [services/react-query/ReactQueryProvider.tsx](/services/react-query/ReactQueryProvider.tsx) | TypeScript JSX | 11 | 1 | 6 | 18 |
| [services/react-query/auth/index.ts](/services/react-query/auth/index.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [services/react-query/auth/signOut.ts](/services/react-query/auth/signOut.ts) | TypeScript | 10 | 0 | 4 | 14 |
| [services/react-query/index.ts](/services/react-query/index.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [services/react-query/mutations/player-room/addPlayerToRoom.ts](/services/react-query/mutations/player-room/addPlayerToRoom.ts) | TypeScript | 40 | 7 | 8 | 55 |
| [services/react-query/mutations/player-room/deletePlayerFromRoom.ts](/services/react-query/mutations/player-room/deletePlayerFromRoom.ts) | TypeScript | 32 | 7 | 6 | 45 |
| [services/react-query/mutations/player-room/index.ts](/services/react-query/mutations/player-room/index.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [services/react-query/mutations/player-room/sendInvite.ts](/services/react-query/mutations/player-room/sendInvite.ts) | TypeScript | 32 | 6 | 8 | 46 |
| [services/react-query/mutations/player-room/updateRoomStatus.ts](/services/react-query/mutations/player-room/updateRoomStatus.ts) | TypeScript | 27 | 4 | 5 | 36 |
| [services/react-query/mutations/player/addInvite.ts](/services/react-query/mutations/player/addInvite.ts) | TypeScript | 28 | 7 | 6 | 41 |
| [services/react-query/mutations/player/createPlayer.ts](/services/react-query/mutations/player/createPlayer.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/mutations/player/deleteMail.ts](/services/react-query/mutations/player/deleteMail.ts) | TypeScript | 33 | 6 | 11 | 50 |
| [services/react-query/mutations/player/index.ts](/services/react-query/mutations/player/index.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [services/react-query/mutations/player/sendMail.ts](/services/react-query/mutations/player/sendMail.ts) | TypeScript | 35 | 7 | 8 | 50 |
| [services/react-query/mutations/player/updateCurrentRoomId.ts](/services/react-query/mutations/player/updateCurrentRoomId.ts) | TypeScript | 24 | 3 | 4 | 31 |
| [services/react-query/mutations/sentence-symphony/calculateWinner.ts](/services/react-query/mutations/sentence-symphony/calculateWinner.ts) | TypeScript | 29 | 3 | 8 | 40 |
| [services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts](/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts](/services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts) | TypeScript | 18 | 0 | 5 | 23 |
| [services/react-query/mutations/sentence-symphony/forceSubmissions.ts](/services/react-query/mutations/sentence-symphony/forceSubmissions.ts) | TypeScript | 46 | 1 | 9 | 56 |
| [services/react-query/mutations/sentence-symphony/index.ts](/services/react-query/mutations/sentence-symphony/index.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [services/react-query/mutations/sentence-symphony/startNewRound.ts](/services/react-query/mutations/sentence-symphony/startNewRound.ts) | TypeScript | 54 | 5 | 10 | 69 |
| [services/react-query/mutations/sentence-symphony/submitSentence.ts](/services/react-query/mutations/sentence-symphony/submitSentence.ts) | TypeScript | 38 | 1 | 7 | 46 |
| [services/react-query/mutations/sentence-symphony/updateVote.ts](/services/react-query/mutations/sentence-symphony/updateVote.ts) | TypeScript | 47 | 1 | 7 | 55 |
| [services/react-query/queries/player-room/getPlayerRoom.ts](/services/react-query/queries/player-room/getPlayerRoom.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [services/react-query/queries/player-room/index.ts](/services/react-query/queries/player-room/index.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [services/react-query/queries/player/getPlayer.ts](/services/react-query/queries/player/getPlayer.ts) | TypeScript | 14 | 0 | 5 | 19 |
| [services/react-query/queries/player/getPlayerByUsername.ts](/services/react-query/queries/player/getPlayerByUsername.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/queries/player/index.ts](/services/react-query/queries/player/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [services/react-query/queries/sentence-symphony/getSentenceSymphony.ts](/services/react-query/queries/sentence-symphony/getSentenceSymphony.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [services/react-query/queries/sentence-symphony/index.ts](/services/react-query/queries/sentence-symphony/index.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [tailwind.config.ts](/tailwind.config.ts) | TypeScript | 91 | 0 | 8 | 99 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 29 | 0 | 1 | 30 |
| [types/AnimalSprites.ts](/types/AnimalSprites.ts) | TypeScript | 14 | 0 | 0 | 14 |
| [types/CustomErrors.ts](/types/CustomErrors.ts) | TypeScript | 15 | 0 | 1 | 16 |
| [types/GameRoomType.ts](/types/GameRoomType.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [types/PlayerRoomStatus.ts](/types/PlayerRoomStatus.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [types/index.ts](/types/index.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/.eslintrc.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/.eslintrc.json) | JSON | -3 | 0 | -1 | -4 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/.prettierrc](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/.prettierrc) | JSON | -5 | 0 | 0 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/README.md](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/README.md) | Markdown | -23 | 0 | -14 | -37 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app.d.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app.d.ts) | TypeScript | -7 | -1 | 0 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/error/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/error/page.tsx) | TypeScript JSX | -33 | 0 | -2 | -35 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/no-duplicate-tabs/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/no-duplicate-tabs/page.tsx) | TypeScript JSX | -6 | 0 | -2 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/example-sign-out/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/example-sign-out/page.tsx) | TypeScript JSX | -25 | -4 | -4 | -33 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/game/[username]/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/game/%5Busername%5D/page.tsx) | TypeScript JSX | -1,061 | -129 | -137 | -1,327 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/home/[username]/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/home/%5Busername%5D/page.tsx) | TypeScript JSX | -449 | -80 | -60 | -589 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/layout.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/layout.tsx) | TypeScript JSX | -28 | -7 | -7 | -42 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageLogin.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageLogin.tsx) | TypeScript JSX | -228 | -12 | -9 | -249 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageOnboarding.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageOnboarding.tsx) | TypeScript JSX | -245 | -23 | -21 | -289 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/callback/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/callback/route.ts) | TypeScript | -59 | -4 | -12 | -75 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/route.ts) | TypeScript | -18 | -3 | -4 | -25 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/logout/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/logout/route.ts) | TypeScript | -18 | -3 | -8 | -29 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player-room/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player-room/get/route.ts) | TypeScript | -9 | 0 | -4 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player-room/update/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player-room/update/route.ts) | TypeScript | -14 | 0 | -4 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/create/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/create/route.ts) | TypeScript | -24 | 0 | -5 | -29 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get-by-username/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get-by-username/route.ts) | TypeScript | -13 | 0 | -5 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get/route.ts) | TypeScript | -9 | 0 | -4 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/update/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/update/route.ts) | TypeScript | -11 | 0 | -4 | -15 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/create/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/create/route.ts) | TypeScript | -29 | 0 | -4 | -33 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/delete/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/delete/route.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/get/route.ts) | TypeScript | -9 | 0 | -4 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/update/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/update/route.ts) | TypeScript | -14 | 0 | -4 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/auth/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/auth/route.ts) | TypeScript | -154 | -30 | -21 | -205 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/changeScene/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/changeScene/route.ts) | TypeScript | -15 | 0 | -4 | -19 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/chatLog/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/chatLog/route.ts) | TypeScript | -15 | 0 | -4 | -19 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/sendData/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/home/sendData/route.ts) | TypeScript | -18 | 0 | -5 | -23 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/shared/redirect/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/shared/redirect/route.ts) | TypeScript | -18 | 0 | -5 | -23 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameRoomCreated/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameRoomCreated/route.ts) | TypeScript | -12 | 0 | -12 | -24 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameTimer/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameTimer/route.ts) | TypeScript | -30 | -1 | -17 | -48 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/generatePrompt/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/generatePrompt/route.ts) | TypeScript | -13 | 0 | -11 | -24 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newMessage/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newMessage/route.ts) | TypeScript | -15 | 0 | -4 | -19 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newRound/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newRound/route.ts) | TypeScript | -12 | -2 | -11 | -25 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/roundChange/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/roundChange/route.ts) | TypeScript | -26 | 0 | -12 | -38 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submitResponse/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submitResponse/route.ts) | TypeScript | -35 | -4 | -18 | -57 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submittedResponse/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submittedResponse/route.ts) | TypeScript | -20 | -5 | -14 | -39 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/topContributor/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/topContributor/route.ts) | TypeScript | -13 | 0 | -10 | -23 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateContributions/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateContributions/route.ts) | TypeScript | -21 | 0 | -10 | -31 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateData/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateData/route.ts) | TypeScript | -15 | 0 | -10 | -25 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateResponses/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateResponses/route.ts) | TypeScript | -13 | 0 | -11 | -24 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateStory/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/updateStory/route.ts) | TypeScript | -12 | 0 | -11 | -23 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/globals.css](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/globals.css) | CSS | -3 | 0 | -2 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/layout.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/layout.tsx) | TypeScript JSX | -26 | 0 | -4 | -30 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/not-found.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/not-found.tsx) | TypeScript JSX | -10 | 0 | -2 | -12 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/page.tsx) | TypeScript JSX | -29 | -4 | -4 | -37 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ChatLogPhaser.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ChatLogPhaser.tsx) | TypeScript JSX | -189 | -6 | -13 | -208 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/DrawingCanvas.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/DrawingCanvas.tsx) | TypeScript JSX | -107 | -26 | -13 | -146 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/EaselPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/EaselPopup.tsx) | TypeScript JSX | -27 | 0 | -5 | -32 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/HelpPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/HelpPopup.tsx) | TypeScript JSX | -185 | -8 | -9 | -202 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/InvitePopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/InvitePopup.tsx) | TypeScript JSX | -237 | -5 | -25 | -267 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/Mail.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/Mail.tsx) | TypeScript JSX | -94 | -6 | -8 | -108 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/MailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/MailPopup.tsx) | TypeScript JSX | -74 | -1 | -9 | -84 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ReadMailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ReadMailPopup.tsx) | TypeScript JSX | -71 | 0 | -11 | -82 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/SendMailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/SendMailPopup.tsx) | TypeScript JSX | -105 | -4 | -8 | -117 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/stopwatch.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/stopwatch.tsx) | TypeScript JSX | -55 | -2 | -5 | -62 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ChatLog.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ChatLog.tsx) | TypeScript JSX | -157 | -22 | -12 | -191 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/PieScore.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/PieScore.tsx) | TypeScript JSX | -63 | -2 | -6 | -71 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ResponseCard.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ResponseCard.tsx) | TypeScript JSX | -95 | -13 | -10 | -118 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/VoteCount.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/VoteCount.tsx) | TypeScript JSX | -32 | 0 | -3 | -35 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/timer.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/timer.tsx) | TypeScript JSX | -60 | -2 | -5 | -67 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/environment.d.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/environment.d.ts) | TypeScript | -13 | 0 | -2 | -15 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/global.d.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/global.d.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/next.config.js](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/next.config.js) | JavaScript | -8 | -2 | -3 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/package-lock.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/package-lock.json) | JSON | -5,800 | 0 | -1 | -5,801 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/package.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/package.json) | JSON | -49 | 0 | -1 | -50 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/Game.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/Game.tsx) | TypeScript JSX | -85 | -3 | -11 | -99 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/functions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/functions.ts) | TypeScript | -56 | -7 | -5 | -68 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/exterior.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/exterior.ts) | TypeScript | -278 | -38 | -86 | -402 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/interior.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/interior.ts) | TypeScript | -287 | -166 | -84 | -537 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/studyroom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/studyroom.ts) | TypeScript | -58 | -3 | -36 | -97 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/settings/consts.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/settings/consts.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/settings/functions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/settings/functions.ts) | TypeScript | -18 | -1 | -2 | -21 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/index.ts) | TypeScript | -2 | 0 | 0 | -2 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/types.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useHomeStore.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useHomeStore.ts) | TypeScript | -64 | -4 | -8 | -76 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useMultiplayerStore.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useMultiplayerStore.ts) | TypeScript | -107 | -10 | -15 | -132 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/IRedirectParams.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/IRedirectParams.ts) | TypeScript | -5 | 0 | 0 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/ISendDataParams.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/ISendDataParams.ts) | TypeScript | -6 | 0 | -1 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/player.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/player.ts) | TypeScript | -9 | 0 | -1 | -10 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/postcss.config.js](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/postcss.config.js) | JavaScript | -6 | 0 | -1 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/background.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/background.json) | JSON | -41 | 0 | 0 | -41 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/interior.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/interior.json) | JSON | -41 | 0 | -1 | -42 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/LuciaSessionProvider.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/LuciaSessionProvider.tsx) | TypeScript JSX | -27 | -10 | -7 | -44 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/functions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/functions.ts) | TypeScript | -23 | -12 | -9 | -44 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/index.ts) | TypeScript | -28 | -4 | -6 | -38 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/models.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/models.ts) | TypeScript | -33 | -1 | -11 | -45 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/index.ts) | TypeScript | -1 | -4 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/Player.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/Player.ts) | TypeScript | -57 | 0 | -15 | -72 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/PlayerRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/PlayerRoom.ts) | TypeScript | -48 | 0 | -14 | -62 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/BaseGameRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/BaseGameRoom.ts) | TypeScript | -22 | 0 | -7 | -29 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/SentenceSymphonyGameRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/SentenceSymphonyGameRoom.ts) | TypeScript | -67 | 0 | -18 | -85 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/index.ts) | TypeScript | -2 | -4 | -2 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/types.ts) | TypeScript | -5 | 0 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/mongoose.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/mongoose.ts) | TypeScript | -24 | -7 | -7 | -38 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/client.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/client.ts) | TypeScript | -14 | -1 | -2 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/server.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/server.ts) | TypeScript | -8 | 0 | -1 | -9 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/types.ts) | TypeScript | -7 | -1 | -1 | -9 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryHydrate.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryHydrate.tsx) | TypeScript JSX | -5 | 0 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryProvider.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryProvider.tsx) | TypeScript JSX | -11 | -1 | -6 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/index.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/signOut.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/signOut.ts) | TypeScript | -10 | 0 | -4 | -14 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/index.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/addPlayerToRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/addPlayerToRoom.ts) | TypeScript | -40 | -7 | -8 | -55 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/deletePlayerFromRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/deletePlayerFromRoom.ts) | TypeScript | -32 | -7 | -6 | -45 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/sendInvite.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player-room/sendInvite.ts) | TypeScript | -32 | -6 | -8 | -46 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/addInvite.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/addInvite.ts) | TypeScript | -28 | -7 | -6 | -41 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/createPlayer.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/createPlayer.ts) | TypeScript | -12 | 0 | -4 | -16 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/deleteMail.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/deleteMail.ts) | TypeScript | -33 | -6 | -11 | -50 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/sendMail.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/sendMail.ts) | TypeScript | -35 | -7 | -8 | -50 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/updateCurrentRoomId.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/player/updateCurrentRoomId.ts) | TypeScript | -24 | -3 | -4 | -31 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/calculateWinner.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/calculateWinner.ts) | TypeScript | -29 | -3 | -8 | -40 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts) | TypeScript | -12 | 0 | -4 | -16 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts) | TypeScript | -15 | 0 | -5 | -20 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/forceSubmissions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/forceSubmissions.ts) | TypeScript | -46 | -1 | -9 | -56 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/index.ts) | TypeScript | -7 | 0 | -1 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/startNewRound.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/startNewRound.ts) | TypeScript | -54 | -5 | -10 | -69 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/submitSentence.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/submitSentence.ts) | TypeScript | -38 | -1 | -7 | -46 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/updateVote.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/updateVote.ts) | TypeScript | -47 | -1 | -7 | -55 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player-room/getPlayerRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player-room/getPlayerRoom.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player-room/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player-room/index.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/getPlayer.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/getPlayer.ts) | TypeScript | -14 | 0 | -5 | -19 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/getPlayerByUsername.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/getPlayerByUsername.ts) | TypeScript | -12 | 0 | -4 | -16 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/player/index.ts) | TypeScript | -2 | 0 | 0 | -2 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/sentence-symphony/getSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/sentence-symphony/getSentenceSymphony.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/sentence-symphony/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/sentence-symphony/index.ts) | TypeScript | -1 | 0 | -1 | -2 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/tailwind.config.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/tailwind.config.ts) | TypeScript | -90 | 0 | -10 | -100 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/tsconfig.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/tsconfig.json) | JSON with Comments | -29 | 0 | -1 | -30 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/AnimalSprites.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/AnimalSprites.ts) | TypeScript | -14 | 0 | 0 | -14 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/CustomErrors.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/CustomErrors.ts) | TypeScript | -15 | 0 | -1 | -16 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/GameRoomType.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/GameRoomType.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/PlayerRoomStatus.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/PlayerRoomStatus.ts) | TypeScript | -7 | 0 | -1 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/index.ts) | TypeScript | -4 | 0 | 0 | -4 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details