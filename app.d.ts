/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("@/services/lucia").Auth;
	type DatabaseUserAttributes = {
		uid: string;
	};
	type DatabaseSessionAttributes = {};
}