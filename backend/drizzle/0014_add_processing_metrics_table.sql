CREATE TABLE "processing_metrics" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "feature" varchar(100) NOT NULL,
  "duration_ms" integer NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT NOW()
);
