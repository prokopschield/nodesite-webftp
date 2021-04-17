export declare function authenticate(username: string, password: string): boolean;
export declare function createUser(username: string, password: string): boolean;
export declare const sessions: {
    [session: string]: string;
};
export declare function createSession(username: string, password: string): string | false;
export declare function validateSession(session: string): string | undefined;
