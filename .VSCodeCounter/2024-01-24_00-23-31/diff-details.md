# Diff Details

Date : 2024-01-24 00:23:31

Directory /Users/kennethchap/Documents/GitHub/fish

Total : 221 files,  1080 codes, -467 comments, 77 blanks, all 690 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.json](/.eslintrc.json) | JSON | 3 | 0 | 1 | 4 |
| [.prettierrc](/.prettierrc) | JSON | 5 | 0 | 0 | 5 |
| [README.md](/README.md) | Markdown | 23 | 0 | 14 | 37 |
| [app.d.ts](/app.d.ts) | TypeScript | 7 | 1 | 0 | 8 |
| [app/(errors)/no-duplicate-tabs/page.tsx](/app/(errors)/no-duplicate-tabs/page.tsx) | TypeScript JSX | 6 | 0 | 2 | 8 |
| [app/(protected)/example-sign-out/page.tsx](/app/(protected)/example-sign-out/page.tsx) | TypeScript JSX | 25 | 4 | 4 | 33 |
| [app/(protected)/game/[username]/page.tsx](/app/(protected)/game/%5Busername%5D/page.tsx) | TypeScript JSX | 897 | 85 | 104 | 1,086 |
| [app/(protected)/home/[username]/page.tsx](/app/(protected)/home/%5Busername%5D/page.tsx) | TypeScript JSX | 211 | 54 | 30 | 295 |
| [app/(protected)/layout.tsx](/app/(protected)/layout.tsx) | TypeScript JSX | 28 | 7 | 7 | 42 |
| [app/TitlePageLogin.tsx](/app/TitlePageLogin.tsx) | TypeScript JSX | 192 | 10 | 9 | 211 |
| [app/TitlePageOnboarding.tsx](/app/TitlePageOnboarding.tsx) | TypeScript JSX | 245 | 23 | 21 | 289 |
| [app/api/auth/login/google/callback/route.ts](/app/api/auth/login/google/callback/route.ts) | TypeScript | 58 | 4 | 12 | 74 |
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
| [app/api/db/sentence-symphony/update/route.ts](/app/api/db/sentence-symphony/update/route.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [app/api/pusher/auth/route.ts](/app/api/pusher/auth/route.ts) | TypeScript | 151 | 30 | 21 | 202 |
| [app/api/pusher/home/requestData/route.ts](/app/api/pusher/home/requestData/route.ts) | TypeScript | 17 | 0 | 5 | 22 |
| [app/api/pusher/home/sendData/route.ts](/app/api/pusher/home/sendData/route.ts) | TypeScript | 18 | 0 | 5 | 23 |
| [app/api/pusher/symphony/gameRoomCreated/route.ts](/app/api/pusher/symphony/gameRoomCreated/route.ts) | TypeScript | 12 | 0 | 12 | 24 |
| [app/api/pusher/symphony/gameTimer/route.ts](/app/api/pusher/symphony/gameTimer/route.ts) | TypeScript | 27 | 1 | 14 | 42 |
| [app/api/pusher/symphony/generatePrompt/route.ts](/app/api/pusher/symphony/generatePrompt/route.ts) | TypeScript | 14 | 0 | 10 | 24 |
| [app/api/pusher/symphony/newMessage/route.ts](/app/api/pusher/symphony/newMessage/route.ts) | TypeScript | 15 | 0 | 4 | 19 |
| [app/api/pusher/symphony/roundChange/route.ts](/app/api/pusher/symphony/roundChange/route.ts) | TypeScript | 26 | 0 | 12 | 38 |
| [app/api/pusher/symphony/submittedResponse/route.ts](/app/api/pusher/symphony/submittedResponse/route.ts) | TypeScript | 26 | 20 | 21 | 67 |
| [app/api/pusher/symphony/updateContributions/route.ts](/app/api/pusher/symphony/updateContributions/route.ts) | TypeScript | 12 | 0 | 11 | 23 |
| [app/api/pusher/symphony/updateData/route.ts](/app/api/pusher/symphony/updateData/route.ts) | TypeScript | 13 | 0 | 10 | 23 |
| [app/globals.css](/app/globals.css) | CSS | 3 | 0 | 2 | 5 |
| [app/layout.tsx](/app/layout.tsx) | TypeScript JSX | 23 | 0 | 4 | 27 |
| [app/not-found.tsx](/app/not-found.tsx) | TypeScript JSX | 8 | 0 | 2 | 10 |
| [app/page.tsx](/app/page.tsx) | TypeScript JSX | 29 | 4 | 4 | 37 |
| [components/InvitePopup.tsx](/components/InvitePopup.tsx) | TypeScript JSX | 72 | 1 | 8 | 81 |
| [components/Mail.tsx](/components/Mail.tsx) | TypeScript JSX | 54 | 7 | 5 | 66 |
| [components/MailPopup.tsx](/components/MailPopup.tsx) | TypeScript JSX | 76 | 1 | 8 | 85 |
| [components/ReadMailPopup.tsx](/components/ReadMailPopup.tsx) | TypeScript JSX | 22 | 7 | 3 | 32 |
| [components/SendMailPopup.tsx](/components/SendMailPopup.tsx) | TypeScript JSX | 72 | 3 | 4 | 79 |
| [components/symphony/ChatLog.tsx](/components/symphony/ChatLog.tsx) | TypeScript JSX | 158 | 31 | 13 | 202 |
| [components/symphony/PieScore.tsx](/components/symphony/PieScore.tsx) | TypeScript JSX | 63 | 2 | 6 | 71 |
| [components/symphony/ResponseCard.tsx](/components/symphony/ResponseCard.tsx) | TypeScript JSX | 85 | 4 | 7 | 96 |
| [components/symphony/VoteCount.tsx](/components/symphony/VoteCount.tsx) | TypeScript JSX | 32 | 0 | 3 | 35 |
| [environment.d.ts](/environment.d.ts) | TypeScript | 13 | 0 | 2 | 15 |
| [global.d.ts](/global.d.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [next.config.js](/next.config.js) | JavaScript | 8 | 2 | 3 | 13 |
| [package-lock.json](/package-lock.json) | JSON | 5,779 | 0 | 1 | 5,780 |
| [package.json](/package.json) | JSON | 47 | 0 | 1 | 48 |
| [phaser/Game.tsx](/phaser/Game.tsx) | TypeScript JSX | 76 | 3 | 11 | 90 |
| [phaser/functions.ts](/phaser/functions.ts) | TypeScript | 50 | 7 | 0 | 57 |
| [phaser/scenes/exterior.ts](/phaser/scenes/exterior.ts) | TypeScript | 210 | 34 | 57 | 301 |
| [phaser/scenes/interior.ts](/phaser/scenes/interior.ts) | TypeScript | 264 | 166 | 78 | 508 |
| [phaser/scenes/studyroom.ts](/phaser/scenes/studyroom.ts) | TypeScript | 15 | 5 | 5 | 25 |
| [phaser/settings/consts.ts](/phaser/settings/consts.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [phaser/settings/functions.ts](/phaser/settings/functions.ts) | TypeScript | 18 | 1 | 2 | 21 |
| [phaser/stores/index.ts](/phaser/stores/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [phaser/stores/types.ts](/phaser/stores/types.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [phaser/stores/useHomeStore.ts](/phaser/stores/useHomeStore.ts) | TypeScript | 43 | 3 | 7 | 53 |
| [phaser/stores/useMultiplayerStore.ts](/phaser/stores/useMultiplayerStore.ts) | TypeScript | 107 | 10 | 14 | 131 |
| [phaser/types/IRequestDataParams.ts](/phaser/types/IRequestDataParams.ts) | TypeScript | 5 | 0 | 0 | 5 |
| [phaser/types/ISendDataParams.ts](/phaser/types/ISendDataParams.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [phaser/types/index.ts](/phaser/types/index.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [phaser/types/player.ts](/phaser/types/player.ts) | TypeScript | 9 | 0 | 1 | 10 |
| [postcss.config.js](/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [public/backgrounds/background.json](/public/backgrounds/background.json) | JSON | 41 | 0 | 0 | 41 |
| [public/backgrounds/interior.json](/public/backgrounds/interior.json) | JSON | 41 | 0 | 1 | 42 |
| [services/lucia/LuciaSessionProvider.tsx](/services/lucia/LuciaSessionProvider.tsx) | TypeScript JSX | 27 | 10 | 7 | 44 |
| [services/lucia/functions.ts](/services/lucia/functions.ts) | TypeScript | 23 | 12 | 9 | 44 |
| [services/lucia/index.ts](/services/lucia/index.ts) | TypeScript | 28 | 4 | 6 | 38 |
| [services/lucia/models.ts](/services/lucia/models.ts) | TypeScript | 33 | 1 | 11 | 45 |
| [services/mongo/index.ts](/services/mongo/index.ts) | TypeScript | 1 | 4 | 2 | 7 |
| [services/mongo/models/Player.ts](/services/mongo/models/Player.ts) | TypeScript | 55 | 0 | 14 | 69 |
| [services/mongo/models/PlayerRoom.ts](/services/mongo/models/PlayerRoom.ts) | TypeScript | 48 | 0 | 14 | 62 |
| [services/mongo/models/game/BaseGameRoom.ts](/services/mongo/models/game/BaseGameRoom.ts) | TypeScript | 22 | 0 | 7 | 29 |
| [services/mongo/models/game/SentenceSymphonyGameRoom.ts](/services/mongo/models/game/SentenceSymphonyGameRoom.ts) | TypeScript | 67 | 0 | 18 | 85 |
| [services/mongo/models/game/index.ts](/services/mongo/models/game/index.ts) | TypeScript | 2 | 4 | 2 | 8 |
| [services/mongo/models/index.ts](/services/mongo/models/index.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [services/mongo/models/types.ts](/services/mongo/models/types.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [services/mongo/mongoose.ts](/services/mongo/mongoose.ts) | TypeScript | 24 | 7 | 7 | 38 |
| [services/pusher/client.ts](/services/pusher/client.ts) | TypeScript | 14 | 1 | 2 | 17 |
| [services/pusher/index.ts](/services/pusher/index.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [services/pusher/server.ts](/services/pusher/server.ts) | TypeScript | 8 | 0 | 1 | 9 |
| [services/pusher/types.ts](/services/pusher/types.ts) | TypeScript | 7 | 1 | 1 | 9 |
| [services/react-query/ReactQueryHydrate.tsx](/services/react-query/ReactQueryHydrate.tsx) | TypeScript JSX | 5 | 0 | 2 | 7 |
| [services/react-query/ReactQueryProvider.tsx](/services/react-query/ReactQueryProvider.tsx) | TypeScript JSX | 11 | 1 | 6 | 18 |
| [services/react-query/auth/index.ts](/services/react-query/auth/index.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [services/react-query/auth/signOut.ts](/services/react-query/auth/signOut.ts) | TypeScript | 10 | 0 | 4 | 14 |
| [services/react-query/index.ts](/services/react-query/index.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [services/react-query/mutations/player-room/addPlayerToRoom.ts](/services/react-query/mutations/player-room/addPlayerToRoom.ts) | TypeScript | 37 | 5 | 7 | 49 |
| [services/react-query/mutations/player-room/deletePlayerFromRoom.ts](/services/react-query/mutations/player-room/deletePlayerFromRoom.ts) | TypeScript | 32 | 7 | 6 | 45 |
| [services/react-query/mutations/player-room/index.ts](/services/react-query/mutations/player-room/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [services/react-query/mutations/player/createPlayer.ts](/services/react-query/mutations/player/createPlayer.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/mutations/player/index.ts](/services/react-query/mutations/player/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [services/react-query/mutations/player/updateCurrentRoomId.ts](/services/react-query/mutations/player/updateCurrentRoomId.ts) | TypeScript | 24 | 3 | 4 | 31 |
| [services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts](/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts](/services/react-query/mutations/sentence-symphony/deleteSentenceSymphony.ts) | TypeScript | 15 | 0 | 5 | 20 |
| [services/react-query/mutations/sentence-symphony/forceSubmissions.ts](/services/react-query/mutations/sentence-symphony/forceSubmissions.ts) | TypeScript | 45 | 1 | 9 | 55 |
| [services/react-query/mutations/sentence-symphony/index.ts](/services/react-query/mutations/sentence-symphony/index.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [services/react-query/mutations/sentence-symphony/startNewRound.ts](/services/react-query/mutations/sentence-symphony/startNewRound.ts) | TypeScript | 54 | 5 | 10 | 69 |
| [services/react-query/mutations/sentence-symphony/submitSentence.ts](/services/react-query/mutations/sentence-symphony/submitSentence.ts) | TypeScript | 36 | 1 | 7 | 44 |
| [services/react-query/mutations/sentence-symphony/updateVote.ts](/services/react-query/mutations/sentence-symphony/updateVote.ts) | TypeScript | 46 | 1 | 7 | 54 |
| [services/react-query/queries/player-room/getPlayerRoom.ts](/services/react-query/queries/player-room/getPlayerRoom.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/queries/player-room/index.ts](/services/react-query/queries/player-room/index.ts) | TypeScript | 1 | 0 | 0 | 1 |
| [services/react-query/queries/player/getPlayer.ts](/services/react-query/queries/player/getPlayer.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [services/react-query/queries/player/getPlayerByUsername.ts](/services/react-query/queries/player/getPlayerByUsername.ts) | TypeScript | 12 | 0 | 4 | 16 |
| [services/react-query/queries/player/index.ts](/services/react-query/queries/player/index.ts) | TypeScript | 2 | 0 | 0 | 2 |
| [services/react-query/queries/sentence-symphony/getSentenceSymphony.ts](/services/react-query/queries/sentence-symphony/getSentenceSymphony.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [services/react-query/queries/sentence-symphony/index.ts](/services/react-query/queries/sentence-symphony/index.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [tailwind.config.ts](/tailwind.config.ts) | TypeScript | 80 | 0 | 7 | 87 |
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
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/no-duplicate-tabs/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(errors)/no-duplicate-tabs/page.tsx) | TypeScript JSX | -6 | 0 | -2 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/example-sign-out/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/example-sign-out/page.tsx) | TypeScript JSX | -25 | -4 | -4 | -33 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/game/[username]/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/game/%5Busername%5D/page.tsx) | TypeScript JSX | -492 | -70 | -68 | -630 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/home/[username]/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/home/%5Busername%5D/page.tsx) | TypeScript JSX | -112 | -5 | -16 | -133 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/layout.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/(protected)/layout.tsx) | TypeScript JSX | -26 | -7 | -7 | -40 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageLogin.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageLogin.tsx) | TypeScript JSX | -192 | -10 | -9 | -211 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageOnboarding.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/TitlePageOnboarding.tsx) | TypeScript JSX | -245 | -23 | -21 | -289 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/callback/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/callback/route.ts) | TypeScript | -57 | -4 | -11 | -72 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/login/google/route.ts) | TypeScript | -18 | -3 | -4 | -25 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/logout/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/auth/logout/route.ts) | TypeScript | -18 | -3 | -8 | -29 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/game-room/create/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/game-room/create/route.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/game-room/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/game-room/get/route.ts) | TypeScript | 0 | 0 | -1 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/create/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/create/route.ts) | TypeScript | -24 | 0 | -5 | -29 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get-by-username/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get-by-username/route.ts) | TypeScript | -13 | 0 | -5 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/player/get/route.ts) | TypeScript | -9 | 0 | -4 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/create/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/create/route.ts) | TypeScript | -29 | 0 | -4 | -33 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/delete/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/delete/route.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/get/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/get/route.ts) | TypeScript | -9 | 0 | -4 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/update/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/db/sentence-symphony/update/route.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/auth/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/auth/route.ts) | TypeScript | -18 | -36 | -12 | -66 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/currentPlayers/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/currentPlayers/route.ts) | TypeScript | -24 | -1 | -6 | -31 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/playerMoved/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/playerMoved/route.ts) | TypeScript | -15 | 0 | -4 | -19 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameTimer/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/gameTimer/route.ts) | TypeScript | -25 | -1 | -13 | -39 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/generatePrompt/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/generatePrompt/route.ts) | TypeScript | -12 | 0 | -10 | -22 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newMessage/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/newMessage/route.ts) | TypeScript | -14 | 0 | -4 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/roundChange/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/roundChange/route.ts) | TypeScript | -25 | 0 | -12 | -37 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submittedResponse/route.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/api/pusher/symphony/submittedResponse/route.ts) | TypeScript | -25 | -20 | -21 | -66 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/globals.css](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/globals.css) | CSS | -3 | 0 | -2 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/layout.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/layout.tsx) | TypeScript JSX | -23 | 0 | -4 | -27 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/not-found.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/not-found.tsx) | TypeScript JSX | -8 | 0 | -2 | -10 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/page.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/app/page.tsx) | TypeScript JSX | -28 | -4 | -4 | -36 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/InvitePopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/InvitePopup.tsx) | TypeScript JSX | -72 | -1 | -8 | -81 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/Mail.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/Mail.tsx) | TypeScript JSX | -54 | -7 | -5 | -66 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/MailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/MailPopup.tsx) | TypeScript JSX | -76 | -1 | -8 | -85 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ReadMailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/ReadMailPopup.tsx) | TypeScript JSX | -22 | -7 | -3 | -32 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/SendMailPopup.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/SendMailPopup.tsx) | TypeScript JSX | -72 | -3 | -4 | -79 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ChatLog.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ChatLog.tsx) | TypeScript JSX | -163 | -14 | -13 | -190 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/PieScore.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/PieScore.tsx) | TypeScript JSX | -65 | -1 | -7 | -73 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ResponseCard.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/ResponseCard.tsx) | TypeScript JSX | -50 | -4 | -7 | -61 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/VoteCount.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/components/symphony/VoteCount.tsx) | TypeScript JSX | -27 | -1 | -3 | -31 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/environment.d.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/environment.d.ts) | TypeScript | -13 | 0 | -2 | -15 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/global.d.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/global.d.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/next.config.js](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/next.config.js) | JavaScript | -8 | -2 | -3 | -13 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/package-lock.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/package-lock.json) | JSON | -5,759 | 0 | -1 | -5,760 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/package.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/package.json) | JSON | -44 | 0 | -1 | -45 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/Game.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/Game.tsx) | TypeScript JSX | -81 | -498 | -90 | -669 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/functions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/functions.ts) | TypeScript | -50 | -7 | 0 | -57 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/exterior.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/exterior.ts) | TypeScript | -196 | -124 | -59 | -379 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/interior.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/interior.ts) | TypeScript | -296 | -134 | -78 | -508 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/studyroom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/scenes/studyroom.ts) | TypeScript | -15 | -5 | -5 | -25 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/index.ts) | TypeScript | -2 | 0 | 0 | -2 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/types.ts) | TypeScript | -4 | 0 | -1 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useHomeStore.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useHomeStore.ts) | TypeScript | -43 | -3 | -7 | -53 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useMultiplayerStore.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/stores/useMultiplayerStore.ts) | TypeScript | -94 | -10 | -12 | -116 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/index.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/player.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/phaser/types/player.ts) | TypeScript | -9 | 0 | -1 | -10 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/postcss.config.js](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/postcss.config.js) | JavaScript | -6 | 0 | -1 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/background.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/background.json) | JSON | -41 | 0 | 0 | -41 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/interior.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/public/backgrounds/interior.json) | JSON | -41 | 0 | -1 | -42 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/LuciaSessionProvider.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/LuciaSessionProvider.tsx) | TypeScript JSX | -27 | -10 | -7 | -44 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/functions.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/functions.ts) | TypeScript | -21 | -12 | -9 | -42 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/index.ts) | TypeScript | -28 | -4 | -6 | -38 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/models.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/lucia/models.ts) | TypeScript | -33 | -1 | -11 | -45 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/index.ts) | TypeScript | -1 | -4 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/Player.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/Player.ts) | TypeScript | -68 | -1 | -15 | -84 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/PlayerRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/PlayerRoom.ts) | TypeScript | -45 | 0 | -12 | -57 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/BaseGameRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/BaseGameRoom.ts) | TypeScript | -30 | 0 | -9 | -39 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/SentenceSymphonyGameRoom.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/SentenceSymphonyGameRoom.ts) | TypeScript | -51 | 0 | -14 | -65 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/game/index.ts) | TypeScript | -2 | -4 | -2 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/models/types.ts) | TypeScript | -5 | 0 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/mongoose.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/mongo/mongoose.ts) | TypeScript | -24 | -7 | -7 | -38 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/client.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/client.ts) | TypeScript | -14 | -1 | -3 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/index.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/server.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/server.ts) | TypeScript | -8 | 0 | -1 | -9 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/types.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/pusher/types.ts) | TypeScript | -7 | 0 | -1 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryHydrate.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryHydrate.tsx) | TypeScript JSX | -5 | 0 | -2 | -7 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryProvider.tsx](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/ReactQueryProvider.tsx) | TypeScript JSX | -11 | -1 | -6 | -18 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/index.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/signOut.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/auth/signOut.ts) | TypeScript | -10 | 0 | -4 | -14 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/index.ts) | TypeScript | -6 | 0 | -2 | -8 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/createPlayer.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/createPlayer.ts) | TypeScript | -12 | 0 | -4 | -16 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/createSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/createSentenceSymphony.ts) | TypeScript | -12 | -5 | -5 | -22 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/index.ts) | TypeScript | -1 | 0 | 0 | -1 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/createSentenceSymphony.ts) | TypeScript | -12 | -6 | -5 | -23 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/index.ts) | TypeScript | -2 | 0 | -1 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/submitSentence.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/mutations/sentence-symphony/submitSentence.ts) | TypeScript | -35 | -1 | -7 | -43 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getPlayer.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getPlayer.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getPlayerByUsername.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getPlayerByUsername.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getSentenceSymphony.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/getSentenceSymphony.ts) | TypeScript | -13 | 0 | -4 | -17 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/services/react-query/queries/index.ts) | TypeScript | -3 | 0 | -1 | -4 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/tailwind.config.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/tailwind.config.ts) | TypeScript | -72 | 0 | -6 | -78 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/tsconfig.json](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/tsconfig.json) | JSON with Comments | -29 | 0 | -1 | -30 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/AnimalSprites.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/AnimalSprites.ts) | TypeScript | -14 | 0 | 0 | -14 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/GameRoomType.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/GameRoomType.ts) | TypeScript | -3 | 0 | 0 | -3 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/PlayerRoomStatus.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/PlayerRoomStatus.ts) | TypeScript | -5 | 0 | 0 | -5 |
| [c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/index.ts](/c:/Users/vypha/OneDrive/Documents/GitHub/fish/types/index.ts) | TypeScript | -3 | 0 | 0 | -3 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details