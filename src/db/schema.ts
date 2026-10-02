import { relations, sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  char,
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["ADMIN", "TEACHER", "APPRENTICE"]);

export const submissionStatus = pgEnum("submission_status", ["pending", "graded"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    role: userRole("role").notNull(),
    artistName: text("artist_name"),
    studio: text("studio"),
    nationality: char("nationality", { length: 2 }),
    profileSlug: text("profile_slug").notNull(),
    joinedAt: date("joined_at").notNull().default(sql`CURRENT_DATE`),
  },
  (table) => [
    uniqueIndex("users_email_lower_key").on(sql`lower(${table.email})`),
    uniqueIndex("users_profile_slug_lower_key").on(sql`lower(${table.profileSlug})`),
    check("users_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("users_email_not_blank", sql`length(btrim(${table.email})) > 0`),
    check(
      "users_artist_name_length",
      sql`${table.artistName} IS NULL OR char_length(${table.artistName}) <= 40`,
    ),
    check(
      "users_studio_length",
      sql`${table.studio} IS NULL OR char_length(${table.studio}) <= 60`,
    ),
    check(
      "users_nationality_code",
      sql`${table.nationality} IS NULL OR ${table.nationality} ~ '^[A-Z]{2}$'`,
    ),
    check("users_profile_slug_not_blank", sql`length(btrim(${table.profileSlug})) > 0`),
  ],
);

export const titles = pgTable(
  "titles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    minPersonalLevel: integer("min_personal_level").notNull().unique("titles_min_personal_level_key"),
  },
  (table) => [
    check("titles_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("titles_min_personal_level_positive", sql`${table.minPersonalLevel} >= 1`),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    tagline: text("tagline").notNull(),
    sequenceOrder: integer("sequence_order").notNull().unique("categories_sequence_order_key"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("categories_slug_lower_key").on(sql`lower(${table.slug})`),
    uniqueIndex("categories_name_lower_key").on(sql`lower(${table.name})`),
    check("categories_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("categories_slug_not_blank", sql`length(btrim(${table.slug})) > 0`),
    check("categories_sequence_order_positive", sql`${table.sequenceOrder} >= 1`),
  ],
);

export const levels = pgTable(
  "levels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
    currentVersionId: uuid("current_version_id")
      .notNull()
      .references((): AnyPgColumn => levelVersions.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("levels_category_position_key").on(table.categoryId, table.position),
    check("levels_position_positive", sql`${table.position} >= 1`),
  ],
);

export const levelVersions = pgTable(
  "level_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    levelId: uuid("level_id")
      .notNull()
      .references((): AnyPgColumn => levels.id, { onDelete: "restrict" }),
    versionNumber: integer("version_number").notNull(),
    title: text("title").notNull(),
    objective: text("objective").notNull(),
    exercise: text("exercise").notNull(),
    tips: text("tips").notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("level_versions_level_number_key").on(table.levelId, table.versionNumber),
    check("level_versions_number_positive", sql`${table.versionNumber} >= 1`),
  ],
);

export const levelReferences = pgTable(
  "level_references",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    levelVersionId: uuid("level_version_id")
      .notNull()
      .references(() => levelVersions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").notNull(),
    url: text("url"),
    objectKey: text("object_key"),
    alt: text("alt"),
    width: integer("width"),
    height: integer("height"),
  },
  (table) => [
    uniqueIndex("level_references_version_sort_key").on(table.levelVersionId, table.sortOrder),
    check("level_references_label_not_blank", sql`length(btrim(${table.label})) > 0`),
    check("level_references_sort_order_nonnegative", sql`${table.sortOrder} >= 0`),
    check(
      "level_references_file_pair",
      sql`(${table.url} IS NULL AND ${table.objectKey} IS NULL) OR (${table.url} IS NOT NULL AND ${table.objectKey} IS NOT NULL)`,
    ),
    check(
      "level_references_dimensions",
      sql`(${table.width} IS NULL AND ${table.height} IS NULL) OR (${table.width} > 0 AND ${table.height} > 0)`,
    ),
  ],
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    apprenticeId: uuid("apprentice_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    levelId: uuid("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "restrict" }),
    levelVersionId: uuid("level_version_id")
      .notNull()
      .references(() => levelVersions.id, { onDelete: "restrict" }),
    attemptNumber: integer("attempt_number").notNull(),
    status: submissionStatus("status").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    claimedBy: uuid("claimed_by").references(() => users.id, { onDelete: "restrict" }),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    gradedBy: uuid("graded_by").references(() => users.id, { onDelete: "restrict" }),
    gradedAt: timestamp("graded_at", { withTimezone: true }),
    score: integer("score"),
    feedback: text("feedback"),
    awardedXp: integer("awarded_xp"),
  },
  (table) => [
    uniqueIndex("submissions_attempt_key").on(table.apprenticeId, table.levelId, table.attemptNumber),
    uniqueIndex("submissions_one_pending_per_level")
      .on(table.apprenticeId, table.levelId)
      .where(sql`${table.status} = 'pending'`),
    index("submissions_pending_queue")
      .on(table.submittedAt)
      .where(sql`${table.status} = 'pending'`),
    index("submissions_claimed_by")
      .on(table.claimedBy)
      .where(sql`${table.status} = 'pending'`),
    check("submissions_attempt_number_positive", sql`${table.attemptNumber} >= 1`),
    check(
      "submissions_claim_pair",
      sql`(${table.claimedBy} IS NULL AND ${table.claimedAt} IS NULL) OR (${table.claimedBy} IS NOT NULL AND ${table.claimedAt} IS NOT NULL)`,
    ),
    check(
      "submissions_grade_state",
      sql`(
        ${table.status} = 'pending'
        AND ${table.score} IS NULL
        AND ${table.feedback} IS NULL
        AND ${table.awardedXp} IS NULL
        AND ${table.gradedBy} IS NULL
        AND ${table.gradedAt} IS NULL
      ) OR (
        ${table.status} = 'graded'
        AND ${table.score} BETWEEN 0 AND 10
        AND ${table.awardedXp} = CASE WHEN ${table.score} >= 8 THEN ${table.score} * 10 ELSE 0 END
        AND ${table.gradedBy} IS NOT NULL
        AND ${table.gradedAt} IS NOT NULL
      )`,
    ),
  ],
);

export const submissionPhotos = pgTable(
  "submission_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull(),
    url: text("url").notNull(),
    objectKey: text("object_key").notNull(),
    alt: text("alt"),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
  },
  (table) => [
    uniqueIndex("submission_photos_submission_sort_key").on(table.submissionId, table.sortOrder),
    check("submission_photos_sort_order_nonnegative", sql`${table.sortOrder} >= 0`),
    check("submission_photos_url_not_blank", sql`length(btrim(${table.url})) > 0`),
    check("submission_photos_object_key_not_blank", sql`length(btrim(${table.objectKey})) > 0`),
    check("submission_photos_dimensions", sql`${table.width} > 0 AND ${table.height} > 0`),
  ],
);

export const levelProgress = pgTable(
  "level_progress",
  {
    apprenticeId: uuid("apprentice_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    levelId: uuid("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "restrict" }),
    bestScore: integer("best_score"),
    bestAwardedXp: integer("best_awarded_xp"),
    bestSubmissionId: uuid("best_submission_id").references(() => submissions.id, {
      onDelete: "restrict",
    }),
    attemptCount: integer("attempt_count").notNull(),
    latestScore: integer("latest_score"),
    latestFeedback: text("latest_feedback"),
  },
  (table) => [
    primaryKey({ columns: [table.apprenticeId, table.levelId] }),
    check("level_progress_attempt_count_positive", sql`${table.attemptCount} >= 1`),
    check(
      "level_progress_best_state",
      sql`(
        ${table.bestScore} IS NULL
        AND ${table.bestAwardedXp} IS NULL
        AND ${table.bestSubmissionId} IS NULL
        AND ${table.latestScore} IS NULL
        AND ${table.latestFeedback} IS NULL
      ) OR (
        ${table.bestScore} BETWEEN 0 AND 10
        AND ${table.bestAwardedXp} = CASE WHEN ${table.bestScore} >= 8 THEN ${table.bestScore} * 10 ELSE 0 END
        AND ${table.bestSubmissionId} IS NOT NULL
        AND ${table.latestScore} BETWEEN 0 AND 10
      )`,
    ),
  ],
);

export const styleProgress = pgTable(
  "style_progress",
  {
    apprenticeId: uuid("apprentice_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    categoryXp: integer("category_xp").notNull().default(0),
    currentLevel: integer("current_level").notNull(),
    averageScore: numeric("average_score", { precision: 4, scale: 2, mode: "number" })
      .notNull()
      .default(0),
    levelsCompleted: integer("levels_completed").notNull().default(0),
    isLocked: boolean("is_locked").notNull(),
    isMastered: boolean("is_mastered").notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.apprenticeId, table.categoryId] }),
    index("style_progress_leaderboard")
      .on(table.categoryId, table.categoryXp.desc())
      .where(sql`${table.isLocked} = false AND ${table.categoryXp} > 0`),
    check("style_progress_xp_nonnegative", sql`${table.categoryXp} >= 0`),
    check("style_progress_current_level_positive", sql`${table.currentLevel} >= 1`),
    check("style_progress_average_score_range", sql`${table.averageScore} BETWEEN 0 AND 10`),
    check("style_progress_levels_completed_nonnegative", sql`${table.levelsCompleted} >= 0`),
    check("style_progress_lock_and_mastery", sql`NOT (${table.isLocked} AND ${table.isMastered})`),
  ],
);

export const apprenticeProgress = pgTable(
  "apprentice_progress",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    personalXp: integer("personal_xp").notNull().default(0),
    personalLevel: integer("personal_level").notNull().default(1),
    xpIntoLevel: integer("xp_into_level").notNull().default(0),
    xpForNextLevel: integer("xp_for_next_level").notNull(),
    levelsCompleted: integer("levels_completed").notNull().default(0),
  },
  (table) => [
    check("apprentice_progress_xp_nonnegative", sql`${table.personalXp} >= 0`),
    check("apprentice_progress_level_positive", sql`${table.personalLevel} >= 1`),
    check("apprentice_progress_into_nonnegative", sql`${table.xpIntoLevel} >= 0`),
    check("apprentice_progress_into_below_next", sql`${table.xpIntoLevel} < ${table.xpForNextLevel}`),
    check("apprentice_progress_next_positive", sql`${table.xpForNextLevel} > 0`),
    check(
      "apprentice_progress_levels_completed_nonnegative",
      sql`${table.levelsCompleted} >= 0`,
    ),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  progress: one(apprenticeProgress, {
    fields: [users.id],
    references: [apprenticeProgress.userId],
    relationName: "apprenticeProgress",
  }),
  createdCategories: many(categories),
  authoredVersions: many(levelVersions),
  apprenticeSubmissions: many(submissions, { relationName: "apprenticeSubmissions" }),
  claimedSubmissions: many(submissions, { relationName: "claimedSubmissions" }),
  gradedSubmissions: many(submissions, { relationName: "gradedSubmissions" }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  creator: one(users, {
    fields: [categories.createdBy],
    references: [users.id],
  }),
  levels: many(levels),
}));

export const levelsRelations = relations(levels, ({ one, many }) => ({
  category: one(categories, {
    fields: [levels.categoryId],
    references: [categories.id],
  }),
  currentVersion: one(levelVersions, {
    fields: [levels.currentVersionId],
    references: [levelVersions.id],
    relationName: "currentLevelVersion",
  }),
  versions: many(levelVersions, { relationName: "levelHistory" }),
  submissions: many(submissions),
}));

export const levelVersionsRelations = relations(levelVersions, ({ one, many }) => ({
  level: one(levels, {
    fields: [levelVersions.levelId],
    references: [levels.id],
    relationName: "levelHistory",
  }),
  currentOf: many(levels, { relationName: "currentLevelVersion" }),
  author: one(users, {
    fields: [levelVersions.createdBy],
    references: [users.id],
  }),
  references: many(levelReferences),
  submissions: many(submissions),
}));

export const levelReferencesRelations = relations(levelReferences, ({ one }) => ({
  version: one(levelVersions, {
    fields: [levelReferences.levelVersionId],
    references: [levelVersions.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  apprentice: one(users, {
    fields: [submissions.apprenticeId],
    references: [users.id],
    relationName: "apprenticeSubmissions",
  }),
  claimer: one(users, {
    fields: [submissions.claimedBy],
    references: [users.id],
    relationName: "claimedSubmissions",
  }),
  grader: one(users, {
    fields: [submissions.gradedBy],
    references: [users.id],
    relationName: "gradedSubmissions",
  }),
  level: one(levels, {
    fields: [submissions.levelId],
    references: [levels.id],
  }),
  levelVersion: one(levelVersions, {
    fields: [submissions.levelVersionId],
    references: [levelVersions.id],
  }),
  photos: many(submissionPhotos),
}));

export const submissionPhotosRelations = relations(submissionPhotos, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionPhotos.submissionId],
    references: [submissions.id],
  }),
}));

export const apprenticeProgressRelations = relations(apprenticeProgress, ({ one }) => ({
  user: one(users, {
    fields: [apprenticeProgress.userId],
    references: [users.id],
    relationName: "apprenticeProgress",
  }),
}));
