import { supabase } from './supabaseClient';

// A service to simulate fetching static content data from local JSON.
const fetchStaticContent = async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`./api${endpoint}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${endpoint}: ${response.statusText}`);
    }
    return response.json() as Promise<T>;
};

export const apiService = {
    // Dynamic data fetched directly from Supabase
    getEmergencyContacts: async () => {
        const { data, error } = await supabase.from('emergency_contacts').select('*').order('name');
        if (error) {
            console.error("Error fetching contacts from Supabase:", error);
            // Fallback to local if Supabase isn't configured yet
            return fetchStaticContent<any[]>('/contacts.json');
        }
        return data;
    },

    getDashboardData: async () => {
        // Fetch Telemetry
        const { data: telemetry } = await supabase.from('admin_telemetry').select('*').single();
        const { data: participation } = await supabase.from('participation_stats').select('name, participation');
        const { data: radar } = await supabase.from('preparedness_radar_stats').select('subject, score, full_mark');

        if (telemetry && participation && radar) {
            return {
                preparednessScore: telemetry.preparedness_score,
                studentsTrained: telemetry.students_trained,
                drillsCompleted: telemetry.drills_completed,
                participationByGrade: participation,
                preparednessByDisaster: radar
            };
        }
        // Fallback to local if Supabase isn't configured yet
        return fetchStaticContent<any>('/dashboard.json');
    },

    // Static content still fetched from local JSON for now
    getUsers: async () => {
        const { data } = await supabase.from('profiles').select('*');
        return data || [];
    },
    getVideos: () => fetchStaticContent<any[]>('/videos.json'),
    getEducationData: () => fetchStaticContent<any>('/education.json'),
    getHazardsData: () => fetchStaticContent<any>('/hazards.json'),
};