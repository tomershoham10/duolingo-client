export const isFSAMetadata = (metadata: Partial<Metadata>): metadata is Partial<FSAMetadata> => {
    return (metadata as FSAMetadata).targets_ids_list !== undefined;
}