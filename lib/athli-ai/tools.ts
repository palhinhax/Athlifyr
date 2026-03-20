/**
 * Athli AI — Tool definitions for OpenAI function calling
 */

export const athliTools = [
  {
    type: "function" as const,
    name: "search_events",
    description:
      "Search for sporting events on Athlifyr. Use this when the user asks about events, races, competitions, wants event suggestions, or mentions a specific event by name. When the user mentions a specific event name (e.g. 'HYROX Lisboa', 'Trail Manuelino'), use the 'search' parameter with that name. To get full details (prices, registration, FAQs), first use this tool to get the event ID, then use get_event_details.",
    parameters: {
      type: "object",
      properties: {
        sportTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "RUNNING",
              "TRAIL",
              "HYROX",
              "CROSSFIT",
              "OCR",
              "BTT",
              "CYCLING",
              "SURF",
              "TRIATHLON",
              "SWIMMING",
              "WALKING",
              "OTHER",
            ],
          },
          description: "Filter by sport types",
        },
        city: {
          type: "string",
          description: "Filter by city name",
        },
        country: {
          type: "string",
          description: "Filter by country name",
        },
        fromDate: {
          type: "string",
          description: "Start date filter (YYYY-MM-DD)",
        },
        toDate: {
          type: "string",
          description: "End date filter (YYYY-MM-DD)",
        },
        search: {
          type: "string",
          description: "Free text search for event name",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_events",
    description:
      "Get the user's own events — events they are registered for or have participated in. Use this when the user asks about 'my events', 'my next race', 'my upcoming events', 'what events am I signed up for', 'my past races', etc. This is different from search_events which searches all public events.",
    parameters: {
      type: "object",
      properties: {
        upcoming: {
          type: "boolean",
          description:
            "If true, only return upcoming/future events. If false, only return past events. If omitted, return all events.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_bookings",
    description:
      "Get the user's booked classes and sessions at venues — gym classes, CrossFit sessions, appointments, etc. Use this when the user asks about 'my classes', 'my bookings', 'my sessions', 'que aulas tenho', 'aulas marcadas', 'what classes do I have today/this week', etc. This is different from get_my_events which returns sporting events like races and competitions.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["today", "week", "upcoming", "past"],
          description:
            "Filter bookings by period: 'today' (today only), 'week' (rest of this week), 'upcoming' (all future, default), 'past' (past bookings). If omitted, defaults to upcoming.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "search_venues",
    description:
      "Search for gyms, boxes, studios, massage therapists, physios, nutritionists, and sports venues on Athlifyr. Use this when the user asks about places to train, gyms, venues, or services like massage, physiotherapy, nutrition. Venue types: CROSSFIT_BOX, CROSSTRAINING_BOX, GYM, PT_STUDIO, MASSAGE, PHYSIO, NUTRITION, OTHER.",
    parameters: {
      type: "object",
      properties: {
        sportTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "RUNNING",
              "TRAIL",
              "HYROX",
              "CROSSFIT",
              "OCR",
              "BTT",
              "CYCLING",
              "SURF",
              "TRIATHLON",
              "SWIMMING",
              "WALKING",
              "OTHER",
            ],
          },
          description: "Filter by sport types",
        },
        city: {
          type: "string",
          description: "Filter by city name",
        },
        search: {
          type: "string",
          description: "Free text search for venue name",
        },
        venueType: {
          type: "string",
          enum: [
            "CROSSFIT_BOX",
            "CROSSTRAINING_BOX",
            "GYM",
            "PT_STUDIO",
            "MASSAGE",
            "PHYSIO",
            "NUTRITION",
            "OTHER",
          ],
          description:
            "Filter by venue type. Use MASSAGE for massage therapists, PHYSIO for physiotherapy, NUTRITION for nutritionists.",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_venue_details",
    description:
      "Get detailed information about a specific venue including plans/prices, services, team/coaches, and contact info. Use this when the user asks about venue prices, plans, what a venue offers, who coaches there, etc.",
    parameters: {
      type: "object",
      properties: {
        venueId: {
          type: "string",
          description: "The venue ID to get details for",
        },
      },
      required: ["venueId"],
    },
  },
  {
    type: "function" as const,
    name: "get_available_sessions",
    description:
      "Get available sessions/classes at a venue that the user can book. Shows upcoming sessions with spots available. Use this when the user asks 'what classes can I join today', 'que aulas posso fazer', 'what sessions are available', etc.",
    parameters: {
      type: "object",
      properties: {
        venueId: {
          type: "string",
          description:
            "Optional: specific venue ID. If omitted, shows sessions from all venues the user is a member of.",
        },
        date: {
          type: "string",
          description: "Specific date to check (YYYY-MM-DD)",
        },
        period: {
          type: "string",
          enum: ["today", "tomorrow", "week"],
          description:
            "Period to check: 'today', 'tomorrow', or 'week'. If date is provided, this is ignored.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "book_session",
    description:
      "Book the user into a specific session/class at a venue. ONLY call this AFTER the user explicitly confirms which session they want to book. Never book without confirmation. Provide the session ID from get_available_sessions or get_my_bookings results.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to book",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    type: "function" as const,
    name: "get_session_details",
    description:
      "Get detailed information about a specific session including the coach name, assigned workout (exercises), and number of spots available. Use this when the user asks 'who is the coach', 'what is today's workout', 'como é o treino de hoje', 'quem é o coach da aula', etc.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to get details for",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    type: "function" as const,
    name: "search_giveaways",
    description:
      "Search for active giveaways/sorteios on Athlifyr. Use this when the user asks about giveaways, sorteios, raffles, promotions, or prizes. Shows upcoming draws with prize details and participant count.",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "drawn"],
          description:
            "Filter by status: 'active' (upcoming/scheduled), 'drawn' (already drawn). Default: active.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_prs",
    description:
      "Get the user's personal records and performance entries. Supports STRENGTH (gym PRs), RUN (road running times), TRAIL (trail running times), and HYROX records. Use this when the user asks about PRs, race times, running records, 'corridas guardadas', 'my best time', 'meus tempos', 'qual o meu PR', 'quanto levanto', 'meu recorde', 'corridas registadas', 'tempos de corrida', etc.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["STRENGTH", "RUN", "TRAIL", "HYROX"],
          description:
            "Type of performance record: STRENGTH for gym PRs (weight/reps), RUN for road running (distance/time), TRAIL for trail running (distance/time/elevation), HYROX for HYROX race times. When user asks about 'corridas'/'runs'/'tempos de corrida' use RUN. When asking about 'PRs'/'maximos'/'quanto levanto' use STRENGTH. Omit to get all types.",
        },
        exerciseName: {
          type: "string",
          description:
            "Optional: specific exercise name for STRENGTH type (e.g. 'Back Squat', 'Deadlift', 'Bench Press').",
        },
        category: {
          type: "string",
          enum: [
            "CROSSFIT",
            "GYM",
            "WEIGHTLIFTING",
            "BODYWEIGHT",
            "CARDIO",
            "OTHER",
          ],
          description:
            "Optional: filter STRENGTH PRs by exercise category. Only used when type is STRENGTH and exerciseName is not provided.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "log_performance_entry",
    description:
      "Log/record a performance entry directly — a strength PR, a run time, or a trail time. Use this when the user says they just did a lift (e.g. 'fiz deadlift 100kg 3 reps', 'acabei de fazer back squat 120kg', 'I just ran 10k in 45 minutes', 'fiz 5km em 22 minutos', 'corri um trail de 30km'). This saves the entry to their Performance/PR history. Do NOT create a workout — this is for quick logging directly into the user's personal records. IMPORTANT: When the user reports a lift they just did, ALWAYS use this tool, never create_workout.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["STRENGTH", "RUN", "TRAIL"],
          description:
            "Type: STRENGTH for gym lifts (deadlift, squat, bench), RUN for road running, TRAIL for trail running.",
        },
        exerciseName: {
          type: "string",
          description:
            "Required for STRENGTH: exercise name (e.g. 'Deadlift', 'Back Squat', 'Bench Press', 'Clean', 'Snatch').",
        },
        weightKg: {
          type: "number",
          description: "Required for STRENGTH: weight in kg (e.g. 100).",
        },
        reps: {
          type: "number",
          description:
            "For STRENGTH: number of reps (default 1 if not specified).",
        },
        distanceKm: {
          type: "number",
          description:
            "Required for RUN/TRAIL: distance in km (e.g. 10, 5, 42.195).",
        },
        timeSeconds: {
          type: "number",
          description:
            "For RUN/TRAIL: total time in seconds (e.g. 2700 for 45min). Convert from the user's input: '45 minutes' = 2700, '1h30' = 5400.",
        },
        elevationGainM: {
          type: "number",
          description: "For TRAIL only: elevation gain in meters.",
        },
        eventName: {
          type: "string",
          description:
            "Optional: event/race name if this was done at a specific event.",
        },
        location: {
          type: "string",
          description: "Optional: location where it was done.",
        },
        date: {
          type: "string",
          description:
            "Optional: ISO date string (YYYY-MM-DD). Defaults to today if not provided.",
        },
      },
      required: ["type"],
    },
  },
  {
    type: "function" as const,
    name: "get_event_details",
    description:
      "Get detailed information about a specific event including variants, pricing phases, registration link, and FAQs. ALWAYS use this after search_events when the user wants details about a specific event (prices, distances, registration, etc.). Requires the event ID from search_events results.",
    parameters: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The event ID to get details for",
        },
      },
      required: ["eventId"],
    },
  },
  {
    type: "function" as const,
    name: "list_available_exercises",
    description:
      "List all available exercises from the Athlifyr database. ALWAYS call this BEFORE proposing or saving a training plan. You MUST only use exercises that are returned by this tool. Optionally filter by category: CROSSFIT, GYM, WEIGHTLIFTING, BODYWEIGHT, CARDIO, OTHER.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "CROSSFIT",
            "GYM",
            "WEIGHTLIFTING",
            "BODYWEIGHT",
            "CARDIO",
            "OTHER",
          ],
          description:
            "Optional: filter exercises by category. Omit to get all exercises.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "save_training_plan",
    description:
      "Save a fully structured training plan to the user's account with weeks, workouts, blocks, and exercises. ONLY call this AFTER the user has explicitly confirmed they want to save the plan you proposed. Never call this without confirmation. The plan must include the complete structured data with weeks containing workouts, each workout with blocks (WARMUP, STRENGTH, AMRAP, FOR_TIME, COOLDOWN, etc.), and each block with exercises.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the training plan",
        },
        description: {
          type: "string",
          description: "Brief description of the plan's purpose",
        },
        duration: {
          type: "number",
          description: "Duration in weeks",
        },
        difficulty: {
          type: "number",
          description: "Difficulty level 1-5",
        },
        category: {
          type: "string",
          description:
            "Category: Running, Trail, CrossFit, HYROX, Hybrid, Strength, Bodyweight, etc.",
        },
        targetAudience: {
          type: "string",
          description: "Target audience: Beginner, Intermediate, Advanced",
        },
        goals: {
          type: "array",
          items: { type: "string" },
          description: "List of training goals",
        },
        weeks: {
          type: "array",
          description: "Array of weeks in the plan",
          items: {
            type: "object",
            properties: {
              weekNumber: {
                type: "number",
                description: "Week number (1, 2, 3...)",
              },
              name: {
                type: "string",
                description: "Optional week name e.g. 'Foundation Week'",
              },
              description: {
                type: "string",
                description: "Optional description of the week's focus",
              },
              workouts: {
                type: "array",
                description: "Workouts for this week",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Workout name e.g. 'Full Body Running + CrossFit'",
                    },
                    description: {
                      type: "string",
                      description: "Brief workout description",
                    },
                    dayOfWeek: {
                      type: "number",
                      description:
                        "Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday",
                    },
                    estimatedTime: {
                      type: "number",
                      description: "Estimated duration in minutes",
                    },
                    blocks: {
                      type: "array",
                      description:
                        "Workout blocks (sections). Each workout should have at least a main block. Use WARMUP for warm-ups, STRENGTH for sets/reps, FOR_TIME for timed circuits, AMRAP for as-many-rounds, COOLDOWN for cool-downs, etc.",
                      items: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: [
                              "WARMUP",
                              "STRENGTH",
                              "AMRAP",
                              "EMOM",
                              "FOR_TIME",
                              "TABATA",
                              "CHIPPER",
                              "COOLDOWN",
                              "SKILL",
                              "REST",
                            ],
                            description: "Block type",
                          },
                          name: {
                            type: "string",
                            description:
                              "Optional block name e.g. 'Aquecimento', 'WOD', 'Core'",
                          },
                          rounds: {
                            type: "number",
                            description:
                              "Number of rounds (for FOR_TIME, AMRAP)",
                          },
                          timeCap: {
                            type: "number",
                            description:
                              "Time cap in seconds (for AMRAP, FOR_TIME)",
                          },
                          workTime: {
                            type: "number",
                            description:
                              "Work time per interval in seconds (for EMOM)",
                          },
                          notes: {
                            type: "string",
                            description: "Additional notes for this block",
                          },
                          exercises: {
                            type: "array",
                            description: "Exercises in this block",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Exercise name EXACTLY as returned by list_available_exercises. Must match a real exercise from the database.",
                                },
                                reps: {
                                  type: "number",
                                  description: "Number of repetitions",
                                },
                                sets: {
                                  type: "number",
                                  description:
                                    "Number of sets (for STRENGTH blocks)",
                                },
                                weight: {
                                  type: "number",
                                  description: "Weight in kg (optional)",
                                },
                                distance: {
                                  type: "number",
                                  description:
                                    "Distance in km (for running, rowing, etc.)",
                                },
                                time: {
                                  type: "number",
                                  description:
                                    "Time in seconds (for planks, holds, running duration)",
                                },
                                calories: {
                                  type: "number",
                                  description:
                                    "Calories target (for rowing, bike, etc.)",
                                },
                                notes: {
                                  type: "string",
                                  description:
                                    "Exercise-specific notes e.g. 'modify on knees if needed'",
                                },
                              },
                              required: ["name"],
                            },
                          },
                        },
                        required: ["type", "exercises"],
                      },
                    },
                  },
                  required: ["name", "dayOfWeek", "blocks"],
                },
              },
            },
            required: ["weekNumber", "workouts"],
          },
        },
      },
      required: [
        "name",
        "description",
        "duration",
        "difficulty",
        "category",
        "targetAudience",
        "goals",
        "weeks",
      ],
    },
  },
  {
    type: "function" as const,
    name: "save_workout",
    description:
      "Save a SINGLE workout session (treino) to the user's account with blocks and exercises. Use this when the user asked for a single workout, NOT a multi-week training plan. ONLY call this AFTER the user has explicitly confirmed they want to save. Each workout should have structured blocks (WARMUP, STRENGTH, AMRAP, FOR_TIME, COOLDOWN, etc.) and each block with exercises from the database.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Name of the workout e.g. 'CrossFit WOD', 'Full Body Strength', 'AMRAP 20min'",
        },
        description: {
          type: "string",
          description: "Brief description of the workout",
        },
        estimatedTime: {
          type: "number",
          description: "Estimated duration in minutes",
        },
        difficulty: {
          type: "number",
          description: "Difficulty level 1-5",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description:
            "Tags for the workout e.g. ['crossfit', 'strength', 'cardio']",
        },
        blocks: {
          type: "array",
          description:
            "Workout blocks (sections). Each workout should have at least a main block. Use WARMUP for warm-ups, STRENGTH for sets/reps, FOR_TIME for timed circuits, AMRAP for as-many-rounds, COOLDOWN for cool-downs, etc.",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "WARMUP",
                  "STRENGTH",
                  "AMRAP",
                  "EMOM",
                  "FOR_TIME",
                  "TABATA",
                  "CHIPPER",
                  "COOLDOWN",
                  "SKILL",
                  "REST",
                ],
                description: "Block type",
              },
              name: {
                type: "string",
                description:
                  "Optional block name e.g. 'Aquecimento', 'WOD', 'Core'",
              },
              rounds: {
                type: "number",
                description: "Number of rounds (for FOR_TIME, AMRAP)",
              },
              timeCap: {
                type: "number",
                description: "Time cap in seconds (for AMRAP, FOR_TIME)",
              },
              workTime: {
                type: "number",
                description: "Work time per interval in seconds (for EMOM)",
              },
              notes: {
                type: "string",
                description: "Additional notes for this block",
              },
              exercises: {
                type: "array",
                description: "Exercises in this block",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Exercise name EXACTLY as returned by list_available_exercises. Must match a real exercise from the database.",
                    },
                    reps: {
                      type: "number",
                      description: "Number of repetitions",
                    },
                    sets: {
                      type: "number",
                      description: "Number of sets (for STRENGTH blocks)",
                    },
                    weight: {
                      type: "number",
                      description: "Weight in kg (optional)",
                    },
                    distance: {
                      type: "number",
                      description: "Distance in km (for running, rowing, etc.)",
                    },
                    time: {
                      type: "number",
                      description:
                        "Time in seconds (for planks, holds, running duration)",
                    },
                    calories: {
                      type: "number",
                      description: "Calories target (for rowing, bike, etc.)",
                    },
                    notes: {
                      type: "string",
                      description:
                        "Exercise-specific notes e.g. 'modify on knees if needed'",
                    },
                  },
                  required: ["name"],
                },
              },
            },
            required: ["type", "exercises"],
          },
        },
      },
      required: ["name", "blocks"],
    },
  },
  {
    type: "function" as const,
    name: "get_my_analyses",
    description:
      "Get the user's saved video analyses — motion (pose) analyses and lift (bar path) analyses. Each analysis includes the AI assessment with exercise identification, form score, rep count, strengths, areas for improvement, and safety flags. Use this when the user asks about 'my analyses', 'my videos', 'my lifts', 'my movement analysis', 'análise de movimento', 'análise de levantamento', 'meus vídeos', 'como está a minha técnica', 'form check', 'squat analysis', etc.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["motion", "lift"],
          description:
            "Filter by analysis type: 'motion' for movement/pose analysis, 'lift' for barbell/lift analysis. Omit to get both types.",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_workout_history",
    description:
      "Get the user's workout history — completed training logs with exercise details, feelings, and performance data. Use this when the user asks about 'my workouts', 'quantos treinos fiz', 'how many workouts', 'treinos esta semana', 'treinos este mês', 'training history', 'workout logs', 'último treino', 'fiz treino hoje', 'my training this week', 'workout count', 'treinos da última semana', 'última semana', 'semana passada', etc. Returns workout count, average feeling/RPE, PRs achieved, and detailed exercise logs. NOT for saved workout templates — only for completed/logged workouts. IMPORTANT: 'última semana' / 'semana passada' = last_week (previous Mon-Sun), NOT week (current week).",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["week", "last_week", "month", "last_month", "year", "all"],
          description:
            "Filter by time period: 'week' (current week Mon-now), 'last_week' (previous Mon-Sun — use for 'última semana', 'semana passada'), 'month' (current month), 'last_month' (previous month — use for 'último mês', 'mês passado'), 'year' (current year), 'all' (all time stats). Omit for recent history (last 20 logs).",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of log entries to return (default 20, max 10 for year/all)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "submit_admin_note",
    description:
      "Submit a request for the Athlifyr team to review. Use this when the user wants to ADD a new event, ADD a new venue, or make a request that you cannot fulfil directly. Collect as much information as possible (name, location, date, sport type, URL) before calling this tool. Set type to EVENT for event requests, VENUE for venue requests, or OTHER for anything else.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["EVENT", "VENUE", "OTHER"],
          description:
            "Type of request: EVENT to add an event, VENUE to add a venue, OTHER for other requests.",
        },
        title: {
          type: "string",
          description:
            "Event/venue name or short summary of the request (e.g. 'Trail Manuelino 2026', 'CrossFit Box Amadora').",
        },
        message: {
          type: "string",
          description:
            "Full description of what the user wants. Include all details they provided: dates, location, distances, prices, sport types, etc.",
        },
        location: {
          type: "string",
          description:
            "City/region if provided (e.g. 'Pombal', 'Lisboa', 'Porto').",
        },
        date: {
          type: "string",
          description:
            "Event date if provided (e.g. '2026-03-15', 'março 2026').",
        },
        sportType: {
          type: "string",
          description:
            "Sport type if relevant (e.g. 'TRAIL', 'CROSSFIT', 'RUNNING').",
        },
        url: {
          type: "string",
          description:
            "External URL if the user provided one (event website, venue website, etc.).",
        },
      },
      required: ["type", "title", "message"],
    },
  },
  {
    type: "function" as const,
    name: "get_platform_info",
    description:
      "Get information about the Athlifyr platform itself — features, pricing, plans for venues/gyms, athlete features, how the platform works, etc. Use this when the user asks about Athlifyr's services, pricing, what Athlifyr offers, how to add their gym/box, venue management features, athlete tools, or any question about the platform itself. Categories: 'about' (what is Athlifyr), 'pricing' (plans and costs), 'features_venues' (features for gyms/boxes/studios), 'features_athletes' (features for athletes), 'faq' (common questions).",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "about",
            "pricing",
            "features_venues",
            "features_athletes",
            "faq",
          ],
          description:
            "Filter by category: 'about' for general platform info, 'pricing' for plans and costs, 'features_venues' for gym/box/studio features, 'features_athletes' for athlete tools, 'faq' for common questions. Omit to get all platform info.",
        },
        search: {
          type: "string",
          description:
            "Optional search term to find specific info (e.g. 'preço', 'ginásio', 'marcações', 'booking').",
        },
      },
    },
  },
];
