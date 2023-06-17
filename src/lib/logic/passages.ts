// connect to supabase

import type { CustomUser, GenerationPermission } from "$lib/types";

import type { SupabaseClient } from "@supabase/supabase-js";
import { costToGenerate } from "./points";
import { message } from "sveltekit-superforms/server";

export async function getLastGeneratedDate(supabase: SupabaseClient, user: CustomUser | undefined, quality: number | string): Promise<Date | null> {
    const { data, error } = await supabase.from("passages")
                                          .select("created_at")
                                          .eq("owner_id", user?.id)
                                          .eq("quality", quality)
                                          .order("created_at", { ascending: false })
                                          .limit(1);
    if (error) {
        console.log(error);
    }
    // TODO: refactor
    if(!data || data.length == 0) {
        return null;
    } else {
        return new Date(data[0]?.created_at);
    }
}

export async function isAllowedToGenerate(supabase: SupabaseClient, user: CustomUser | undefined, length: number, multiplier: number, quality: number | string): Promise<GenerationPermission> {
    const lastGeneratedDate = await getLastGeneratedDate(supabase, user, quality);
    let error : "not_enough_points" | "too_soon" | "trial_expired" | "unknown" | undefined = undefined;
    let messages: string[] = [];
    let minutesLeft = 0;
    let enoughTimePassed = true;

    if(lastGeneratedDate != null) {
        const now = new Date();
        const diff = Math.abs(now.getTime() - lastGeneratedDate.getTime());
        const diffHours = Math.ceil(diff / (1000 * 3600));
        minutesLeft = 60 - Math.floor(diff / (1000 * 60));
        enoughTimePassed =  (diffHours > 1);
    }

    const userPoints = user?.profile?.point_balance ?? 0;
    const cost = costToGenerate(length, multiplier);
    const hasEnoughPoints = userPoints > 0 && cost <= userPoints;
    const isTrial = (quality == '3');

    if (!hasEnoughPoints) {
        error = "not_enough_points";
        messages = [`${cost} 🪙`,"Not enough coins","コインが足りません"];
    } else if (isTrial && !enoughTimePassed) {
        error = "too_soon";
        messages = [`${minutesLeft} minutes left till next free passage`,`次の無料のパッセージまであと${minutesLeft}分`];
    }

    const permission: GenerationPermission = {
        ok: isTrial ? enoughTimePassed : hasEnoughPoints,
        error: error,
        messages: messages
    };

    return permission;
}