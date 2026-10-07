import React from 'react';

// The driving game is a heavy, separate chunk (physics, track model, audio). It's split out and
// warmed up ahead of the click so entering it doesn't stall on a network round trip.
let chunk: Promise<typeof import('../game/GamePage')> | null = null;

export const preloadGame = () => (chunk ??= import('../game/GamePage'));

export const GamePage = React.lazy(preloadGame);

export const GAME_PATHS = ['/dream-car', '/game'];
