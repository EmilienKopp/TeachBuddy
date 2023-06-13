export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      actions: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          targets_elements: boolean | null
          targets_users: boolean | null
          verb: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          targets_elements?: boolean | null
          targets_users?: boolean | null
          verb?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          targets_elements?: boolean | null
          targets_users?: boolean | null
          verb?: string | null
        }
        Relationships: []
      }
      actions_history: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          target_element_id: number | null
          target_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          target_element_id?: number | null
          target_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          target_element_id?: number | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_history_target_user_id_fkey"
            columns: ["target_user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      challenges: {
        Row: {
          challengee_id: string
          challenger_id: string
          comment: string | null
          created_at: string | null
          id: number
          passage_id: number | null
          score: number | null
          sverdle_word: string | null
          winner_id: string | null
        }
        Insert: {
          challengee_id: string
          challenger_id: string
          comment?: string | null
          created_at?: string | null
          id?: number
          passage_id?: number | null
          score?: number | null
          sverdle_word?: string | null
          winner_id?: string | null
        }
        Update: {
          challengee_id?: string
          challenger_id?: string
          comment?: string | null
          created_at?: string | null
          id?: number
          passage_id?: number | null
          score?: number | null
          sverdle_word?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challengee_id_fkey"
            columns: ["challengee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_passage_id_fkey"
            columns: ["passage_id"]
            referencedRelation: "passages"
            referencedColumns: ["id"]
          }
        ]
      }
      difficulties: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          level: number | null
          name: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          level?: number | null
          name?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          level?: number | null
          name?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          content: string
          created_at: string | null
          email: string | null
          id: number
          title: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          email?: string | null
          id?: number
          title: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          email?: string | null
          id?: number
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      friendships: {
        Row: {
          approved: boolean
          approved_at: string | null
          created_at: string | null
          friend_id: string
          messages_exchanged: number | null
          passages_exchanged: number | null
          profile_id: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          created_at?: string | null
          friend_id: string
          messages_exchanged?: number | null
          passages_exchanged?: number | null
          profile_id: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          created_at?: string | null
          friend_id?: string
          messages_exchanged?: number | null
          passages_exchanged?: number | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      grades: {
        Row: {
          code: string | null
          created_at: string | null
          id: number
          level: number | null
          name: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: number
          level?: number | null
          name?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: number
          level?: number | null
          name?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          lang_code: string
          name_en: string | null
          name_native: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          lang_code: string
          name_en?: string | null
          name_native?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          lang_code?: string
          name_en?: string | null
          name_native?: string | null
        }
        Relationships: []
      }
      parts_of_speech: {
        Row: {
          alternative_code: string | null
          created_at: string | null
          en_name: string | null
          id: string
          ja_name: string | null
        }
        Insert: {
          alternative_code?: string | null
          created_at?: string | null
          en_name?: string | null
          id: string
          ja_name?: string | null
        }
        Update: {
          alternative_code?: string | null
          created_at?: string | null
          en_name?: string | null
          id?: string
          ja_name?: string | null
        }
        Relationships: []
      }
      passage_lengths: {
        Row: {
          available_for_trial: boolean | null
          created_at: string | null
          id: number
          label: string | null
          word_count: number | null
        }
        Insert: {
          available_for_trial?: boolean | null
          created_at?: string | null
          id?: number
          label?: string | null
          word_count?: number | null
        }
        Update: {
          available_for_trial?: boolean | null
          created_at?: string | null
          id?: number
          label?: string | null
          word_count?: number | null
        }
        Relationships: []
      }
      passage_ratings: {
        Row: {
          created_at: string | null
          passage_id: number
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          passage_id: number
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          passage_id?: number
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passage_ratings_passage_id_fkey"
            columns: ["passage_id"]
            referencedRelation: "passages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passage_ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      passage_types: {
        Row: {
          available_for_trial: boolean | null
          comment: string | null
          created_at: string | null
          difficulty: number | null
          id: number
          name: string | null
          name_en: string | null
        }
        Insert: {
          available_for_trial?: boolean | null
          comment?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: number
          name?: string | null
          name_en?: string | null
        }
        Update: {
          available_for_trial?: boolean | null
          comment?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: number
          name?: string | null
          name_en?: string | null
        }
        Relationships: []
      }
      passages: {
        Row: {
          api_response: Json | null
          content: string | null
          created_at: string | null
          generation_duration: number | null
          grade_id: number | null
          id: number
          language: string | null
          nb_ratings: number | null
          owner_id: string
          prompt: string | null
          quality: string | null
          rating: number | null
          title: string | null
          topic_id: number | null
          topic_string: string | null
          total_time: number | null
          type_id: number | null
          word_count: number | null
        }
        Insert: {
          api_response?: Json | null
          content?: string | null
          created_at?: string | null
          generation_duration?: number | null
          grade_id?: number | null
          id?: number
          language?: string | null
          nb_ratings?: number | null
          owner_id: string
          prompt?: string | null
          quality?: string | null
          rating?: number | null
          title?: string | null
          topic_id?: number | null
          topic_string?: string | null
          total_time?: number | null
          type_id?: number | null
          word_count?: number | null
        }
        Update: {
          api_response?: Json | null
          content?: string | null
          created_at?: string | null
          generation_duration?: number | null
          grade_id?: number | null
          id?: number
          language?: string | null
          nb_ratings?: number | null
          owner_id?: string
          prompt?: string | null
          quality?: string | null
          rating?: number | null
          title?: string | null
          topic_id?: number | null
          topic_string?: string | null
          total_time?: number | null
          type_id?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "passages_language_fkey"
            columns: ["language"]
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
          {
            foreignKeyName: "passages_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      points_master: {
        Row: {
          action_id: number | null
          amount: number | null
          created_at: string | null
          id: number
          multiplier: number | null
          organization_id: string | null
          target_id: string | null
        }
        Insert: {
          action_id?: number | null
          amount?: number | null
          created_at?: string | null
          id?: number
          multiplier?: number | null
          organization_id?: string | null
          target_id?: string | null
        }
        Update: {
          action_id?: number | null
          amount?: number | null
          created_at?: string | null
          id?: number
          multiplier?: number | null
          organization_id?: string | null
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_master_action_id_fkey"
            columns: ["action_id"]
            referencedRelation: "actions"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          native_language: string | null
          point_balance: number | null
          updated_at: string | null
          user_number: string | null
          username: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          native_language?: string | null
          point_balance?: number | null
          updated_at?: string | null
          user_number?: string | null
          username?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          native_language?: string | null
          point_balance?: number | null
          updated_at?: string | null
          user_number?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_native_language_fkey"
            columns: ["native_language"]
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          }
        ]
      }
      quality_levels: {
        Row: {
          ai_model: string | null
          available_for_trial: boolean | null
          created_at: string | null
          id: string | null
          label: string | null
          multiplier: number | null
        }
        Insert: {
          ai_model?: string | null
          available_for_trial?: boolean | null
          created_at?: string | null
          id?: string | null
          label?: string | null
          multiplier?: number | null
        }
        Update: {
          ai_model?: string | null
          available_for_trial?: boolean | null
          created_at?: string | null
          id?: string | null
          label?: string | null
          multiplier?: number | null
        }
        Relationships: []
      }
      scoreboard: {
        Row: {
          activity_id: string | null
          created_at: string | null
          id: string
          score: number | null
          score_unit: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          id: string
          score?: number | null
          score_unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          score_unit?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scoreboard_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      server_logs: {
        Row: {
          created_at: string | null
          href: string | null
          id: number
          method: string | null
          origin: string | null
          pathname: string | null
          referer: string | null
          response_time: number | null
          status: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          href?: string | null
          id?: number
          method?: string | null
          origin?: string | null
          pathname?: string | null
          referer?: string | null
          response_time?: number | null
          status?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string | null
          id?: number
          method?: string | null
          origin?: string | null
          pathname?: string | null
          referer?: string | null
          response_time?: number | null
          status?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      studying_languages: {
        Row: {
          created_at: string | null
          lang_code: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          lang_code: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          lang_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "studying_languages_lang_code_fkey"
            columns: ["lang_code"]
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
          {
            foreignKeyName: "studying_languages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          created_at: string | null
          id: number
          label: string | null
          taggable_id: string | null
          taggable_type: string | null
          tagger_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          label?: string | null
          taggable_id?: string | null
          taggable_type?: string | null
          tagger_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          label?: string | null
          taggable_id?: string | null
          taggable_type?: string | null
          tagger_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_tagger_id_fkey"
            columns: ["tagger_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          id: number
          prompt: string | null
          target_language: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          prompt?: string | null
          target_language?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          prompt?: string | null
          target_language?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_target_language_fkey"
            columns: ["target_language"]
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          }
        ]
      }
      translation: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      user_vocabulary: {
        Row: {
          created_at: string | null
          custom_translation: string | null
          ease_factor: number | null
          id: number
          last_review_date: string | null
          repetition_count: number | null
          review_interval: number | null
          user_id: string | null
          vocabulary_id: number | null
        }
        Insert: {
          created_at?: string | null
          custom_translation?: string | null
          ease_factor?: number | null
          id?: number
          last_review_date?: string | null
          repetition_count?: number | null
          review_interval?: number | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Update: {
          created_at?: string | null
          custom_translation?: string | null
          ease_factor?: number | null
          id?: number
          last_review_date?: string | null
          repetition_count?: number | null
          review_interval?: number | null
          user_id?: string | null
          vocabulary_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_vocabulary_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          }
        ]
      }
      vocabulary: {
        Row: {
          created_at: string | null
          en_word: string | null
          fr_word: string | null
          frequency: number | null
          frequency_rank: number | null
          id: number
          inflection_of: number | null
          inflections: string | null
          isPublic: boolean | null
          ja_word: string | null
          jp_textbook_frequency: number | null
          language: string | null
          POS: string | null
          word: string | null
        }
        Insert: {
          created_at?: string | null
          en_word?: string | null
          fr_word?: string | null
          frequency?: number | null
          frequency_rank?: number | null
          id?: number
          inflection_of?: number | null
          inflections?: string | null
          isPublic?: boolean | null
          ja_word?: string | null
          jp_textbook_frequency?: number | null
          language?: string | null
          POS?: string | null
          word?: string | null
        }
        Update: {
          created_at?: string | null
          en_word?: string | null
          fr_word?: string | null
          frequency?: number | null
          frequency_rank?: number | null
          id?: number
          inflection_of?: number | null
          inflections?: string | null
          isPublic?: boolean | null
          ja_word?: string | null
          jp_textbook_frequency?: number | null
          language?: string | null
          POS?: string | null
          word?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_language_fkey"
            columns: ["language"]
            referencedRelation: "languages"
            referencedColumns: ["lang_code"]
          },
          {
            foreignKeyName: "vocabulary_POS_fkey"
            columns: ["POS"]
            referencedRelation: "parts_of_speech"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
