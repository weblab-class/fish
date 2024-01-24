/// for the discriminators used in this folder, see these citations
// https://techinsights.manisuec.com/mongodb/mongoose-discriminator-non-dry-way-inherit-properties/
// https://dorukgunes.medium.com/nested-discriminator-with-mongoose-ffa0afef5eca
// https://github.com/Automattic/mongoose/issues/10435

export { GameRoomModel } from "./BaseGameRoom";
export { SentenceSymphonyGameRoom, SentenceSymphonyGameRoomModel, type NewSentenceSymphonyGameRoomInput, type UpdateSentenceSymphonyGameRoomInput } from "./SentenceSymphonyGameRoom";
