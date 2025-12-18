import { json } from '@sveltejs/kit';
import { getEvents } from '$lib/services/calendar';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const events = await getEvents();
		return json({ events });
	} catch (error) {
		console.error('Error fetching calendar events:', error);
		return json({ error: 'Failed to fetch calendar events' }, { status: 500 });
	}
};
