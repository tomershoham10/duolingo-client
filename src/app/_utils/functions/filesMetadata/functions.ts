import { ExercisesTypes } from "@/app/API/classes-service/exercises/functions";

export const isFSAMetadata = (metadata: Partial<Metadata> | undefined): metadata is Partial<FSAMetadata> => {
    return metadata !== undefined && (metadata as Partial<FSAMetadata>).record_length !== undefined;
}

export const isRecordMetadata = (metadata: Partial<Metadata> | undefined): metadata is Partial<RecordMetadata> => {
    return metadata !== undefined && (metadata as Partial<RecordMetadata>).record_length !== undefined;
}

export const isSonogramMetadata = (metadata: Partial<Metadata> | undefined, exerciseType: ExercisesTypes): metadata is Partial<SonogramMetadata> => {
    return metadata !== undefined && exerciseType === ExercisesTypes.FSA;
}