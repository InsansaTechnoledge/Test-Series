import { getSupabaseClient } from '../database/SupabaseDB.js';

const supabase = getSupabaseClient();

export const createSyllabus = async (syllabusData) => {

        const { data, error } = await supabase
            .from('batch_syllabus')
            .insert({ syllabusData })
            .select();

        if (error) {
            console.error("Supabase error:", error);
            throw error;    
        }
        return data;
};

export const getSyllabus = async () => {
        const { data, error } = await supabase
            .from('batch_syllabus')
            .select('*');

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        return data;
};

export const updateSyllabus = async (syllabusData, syllabusId) => {

        const { data, error } = await supabase
            .from('batch_syllabus')
            .update(syllabusData)
            .eq('id', syllabusId)
            .select();

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        return data;
};

export const deleteSyllabus = async (syllabusId) => {
        const { data, error } = await supabase
            .from('batch_syllabus')
            .delete()
            .eq('id', syllabusId)
            .select();

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        return data;
};