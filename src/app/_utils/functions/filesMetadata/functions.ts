import { ExercisesTypes } from "@/app/API/classes-service/exercises/functions";

// export const isFSAMetadata = (metadata: Partial<Metadata> | undefined): metadata is Partial<RecordMetadata> => {
//     return metadata !== undefined && (metadata as Partial<RecordMetadata>).record_length !== undefined;
// }

export const isRecordMetadata = (metadata: Partial<Metadata> | undefined): metadata is Partial<RecordMetadata> => {
    return metadata !== undefined && (metadata as Partial<RecordMetadata>).record_length !== undefined;
}

export const isImageMetadata = (metadata: Partial<Metadata> | undefined, exerciseType: ExercisesTypes): metadata is Partial<ImageMetadata> => {
    return metadata !== undefined && exerciseType === ExercisesTypes.FSA;
}