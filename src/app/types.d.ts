////////////////////////////////

// ~~~~~~~ API ~~~~~~~ //

// // courses service // //

// ------ courses ------- //

interface CoursesType {
    _id: string;
    name: string;
    unitsIds: string[];
    suspendedUnitsIds: string[];
}

// ------ units ------- //

interface UnitType {
    _id: string;
    levelsIds: string[];
    suspendedLevelsIds: string[];
    guidebookId?: string;
    description?: string;
}

// ------ levels ------- //

interface LevelType {
    _id: string;
    lessonsIds: string[];
    suspendedLessonsIds: string[];
}

// ------ lessons ------- //

// enum TypesOfLessons {
//     searider = "searider",
//     crew = "crew",
//     senior = "senior",
// }

interface LessonType {
    _id: string;
    name: string;
    exercisesIds: string[];
    suspendedExercisesIds: string[];
    // type: TypesOfLessons;
}

interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}

// ------ exercises ------- //

interface TimeBuffersType {
    timeBuffer: number;
    grade: number;
}

enum ExercisesTypes {
    FSA = "fsa",
    SPOTRECC = "spotrecc"
}

enum FeaturesList {
    NUMBER_OF_BLADES = "numberOfBlades",
}

interface FeatureObject {
    type: FeaturesList,
    value: number | string
}

enum BucketsNames {
    RECORDS = 'records',
    IMAGES = 'images'
}

interface FileObject {
    fileName: string,
    bucket: BucketsNames
}

interface ExerciseType {
    _id: string;
    dateCreated: Date;
    type: ExercisesTypes;
    targetsList?: string[]; //may be 2 correct answers
    timeBuffers: TimeBuffersType[];
    description?: string;
    files: FileObject[]; // if fsa - length === 1

    // fsa
    relevant?: string[];
    acceptableTargets?: string[];

    // spotrecc
    notableFeatures: FeatureObject[];
}

// ------ results ------- //

interface ResultType {
    _id: string;
    userId: string;
    date: Date;
    exerciseId: string;
    answers: string[];
    score: number;
}

// ------ targets ------- //

interface ResponseTargetType extends TargetType {
    __v: number
}

enum TypesOfTargets {
    VESSEL = "vessel",
    SONAR = "sonar",
    TORPEDO = "torpedo"
}

enum TypesOfVessels {
    FRIGATE = "frigate",
    SUBMARINE = "submarine",
    COASTPATROL = "coastPatrol",
    CARGO = "cargo",
    TUGBOAT = "tugboat",
}

enum TypesOfTorpedos {
    ELECTRIC = "electric"
}

enum TypesOfSonars {
    REGULAR = "regular"
}

interface TargetType {
    _id: string;
    name: string;
    countryId: string;
    type: TypesOfTargets;
    subType: TypesOfVessels | TypesOfTorpedos | TypesOfSonars;
}

// ------ sources ------- //

interface ResponseSourceType extends SourceType {
    __v: number
}

interface SourceType {
    _id: string;
    name: string;
}

// // files service // //

interface UploadedObjectInfo {
    etag: string;
    versionId: string | null;
}

enum SignatureTypes {
    PASSIVE = 'passive',
    ACTIVE = 'active',
    PASSIVEACTIVE = 'passive and active',
    TORPEDO = 'torpedo',
}

enum SonarSystem {
    DEMON = 'demon',
    LOFAR = 'lofar'
}

type Metadata = FSAMetadata | SonogramMetadata | SpotreccRecordMetadata | SpotreccImageMetadata;

interface RecordMetadata {
    record_length: number;
    difficulty_level: number;
    // exercise_type: ExerciseTypes;
}

interface ImageMetadata {
    // exercise_type: ExerciseTypes;
}

interface FSAMetadata extends RecordMetadata {
    channels_number: number;
    sonograms_names: string[];
    targets_ids_list: string[];
    operation: string | null;
    source_id: string | null;
    is_in_italy: boolean; //
    aux: boolean;
    is_backround_vessels: boolean;
    signature_type: SignatureTypes; //
    sonar_system: SonarSystem;
}

interface SonogramMetadata extends ImageMetadata {
    sonogram_type: SonarSystem;
    fft: number;
    bw: number;
}

interface SpotreccRecordMetadata extends RecordMetadata {
    targets_ids?: string[];
    notable_features: FeaturesList[];
}

interface SpotreccImageMetadata extends ImageMetadata {
    targets_ids?: string[];
    notable_features: FeaturesList[];
}

interface FileType {
    name: string;
    id?: string;
    exerciseType: ExercisesTypes;
    metadata: Partial<Metadata>;
}

// interface RecordType {
//     name: string;
//     id?: string;
//     metadata: Partial<RecordMetadataType>;
// }

// interface SonogramType {
//     name: string;
//     id?: string;
//     metadata: Partial<SonogramMetadataType>;
// }

// // users service // //

interface UserType {
    _id: string;
    tId?: string;
    userName: string;
    permission: PermissionsTypes;
    password: string;
    courseId?: string;
    nextLessonId?: string;
}

enum PermissionsTypes {
    ADMIN = "admin",
    TEACHER = "teacher",
    CREW = "crew",
    STUDENT = "student"
}

////////////////////////////////

// ~~~~~~~ STORES ~~~~~~~ //

// // useAlertStore // //

enum AlertSizes {
    small = "small",
    medium = "medium",
    large = "large",
}

// // useContextMenuStore // //

interface CoordinatesType {
    pageX: number;
    pageY: number;
}

interface ContentType {
    placeHolder?: string;
    icon?: IconDefinition;
    onClick: () => void;
}

// // useInfoBarStore // //

enum fieldToEditType {
    UNIT = "unit",
    LEVEL = "level",
    LESSON = "lesson",
    EXERCISE = "exercise",
}

// // usePopupStore // //

// enum PopupsTypes {
//     CLOSED = "closed",
//     NEWUSER = "newUser",
//     NEWCOURSE = "newCourse",
//     NEWUNIT = "newUnit",
//     STARTLESSON = "startLesson",
//     ADMINEDIT = "adminEdit",
//     RECORDMETADATA = 'recordMetadata',
//     SONOLISTMETADATA = 'sonolistMetadata'
// }

// // useThemeStore // //

enum Themes {
    LIGHT = "light",
    DARK = "dark",
}

// // useUserStore // //

//*** if changed - also change on file  ***//

enum PermissionsTypes {
    LOGGEDOUT = "loggedOut",
    ADMIN = "admin",
    SEARIDER = "searider",
    SENIOR = "senior",
    TEACHER = "teacher",
    CREW = "crew",
}

////////////////////////////////

// ~~~~~~~ PAGES ~~~~~~~ //

// // classroom // //
// // --> new-exercise <-- // //
// // // --> _ExerciseData <-- // // //

// enum FSAFieldsType {
//     DESCRIPTION = 'description',
//     RELEVANT = 'relevant',
//     TIMEBUFFERS = 'timeBuffers',
// }

////////////////////////////////

// ~~~~~~~ COMPONENTS ~~~~~~~ //

// // AudioPlayer // //

interface AudioPlayerProps {
    src: string;
    isDisabled?: boolean;
    isPauseable?: boolean;
}

// // Button // //

enum ButtonColors {
    BLUE = 'Blue',
    GREEN = 'Green',
    GRAY = 'Gray',
    GRAYGREEN = 'grayGreen',
    GRAYBLUE = 'grayBlue',
    WHITE = 'White',
    PURPLE = 'Purple',
    RED = 'Red',
    YELLOW = 'Yellow',
    ERROR = 'Error',
}

enum ButtonTypes {
    SUBMIT = 'submit',
    BUTTON = 'button',
}

interface ButtonProps {
    label?: string;
    icon?: IconDefinition;
    color: ButtonColors;
    onClick?: () => void;
    href?: string;
    style?: string;
    isDisabled?: boolean;
    buttonType?: ButtonTypes;
    loadingLabel?: string;
    isLoading?: boolean;
}

// // Dropdown // //

enum DropdownSizes {
    SMALL = 'small',
    DEFAULT = 'default',
    LARGE = 'large',
}

interface DropdownProps {
    isSearchable: boolean;
    placeholder: string;
    items: string[];
    value?: string | number | undefined;
    onChange: (value: string) => void;
    className?: string;
    isFailed?: boolean;
    isDisabled?: boolean;
    size: DropdownSizes;
}

// // Input // //

interface InputProps {
    type: InputTypes;
    name?: string;
    placeholder?: string;
    value?: string | undefined;
    onChange?: (value: string) => void;
    className?: string;
    failed?: boolean;
}

// // LessonButton // //

enum Status {
    DONE = 'done',
    PROGRESS = 'progress',
    LOCKED = 'locked',
}

interface LessonButtonProps {
    status: Status;
    numberOfTotalLessons?: number;
    numberOfLessonsMade?: number;
    onClick?: () => void;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}

// // --> CircleGenerator <-- // //

interface CircleGeneratorProps {
    isDarkMode: boolean;
    numberOfTotalLessons: number;
    numberOfLessonsMade: number;
}

// // Navigation // //
// // --> AdminSideBar <-- // //

interface SidebarItem {
    name: string;
    popup?: PopupsTypes;
    icon?: IconDefinition;
    href?: string;
    onClick?: () => void;
    subItems?: SidebarItem[];
}

// // --> NavBar <-- // //

type navItems = {
    label: coursePages;
    href: string;
};

enum coursePages {
    STUDENTS = 'students',
    ASSIGNMENTS = 'assignments',
    SYLLABUS = 'syllabus',
    SETTINGS = 'settings',
}

// // --> Pagination <-- // //

interface PaginationProps {
    header?: string;
    subHeader?: string;
    components: Record<string, React.FC<T>>;
    subProps?: T;
    onNext: Record<string, () => boolean>;
    onSubmit: () => Promise<void>;
}

// // PlusButton // //

interface PlusButtonProps {
    onClick: () => void;
    label?: string;
}

// // ProgressBar // //

interface ProgressBarProps {
    totalNumOfExercises: number;
    numOfExercisesMade: number;
}

// // Slider // //

interface SliderProps {
    isMultiple: boolean;
    errorMode?: boolean;
    numberOfSliders?: number;
    tooltipsValues?: number[] | string[];
    min: number;
    max: number;
    step: number;
    value: number | number[];
    addedValLeftPercentage?: number;
    onSave?: (newScore: number, newTime: number) => void;
    deleteNode?: (index: number) => void;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        index?: number
    ) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLDivElement>, left: number, right: number1) => void;
}

// // SortableItem // //

interface SortableItemProps {
    id: string;
    name: string;
    isGrabbed: boolean;
    isDisabled: boolean;
    addedStyle?: string;
}

// // SwitchButton // //

interface SwitchButtonProps {
    onSwitch: (isChecked: boolean) => void;
}

// // Table // //

type TableProps<T> = {
    headers: string[];
    data: T[];
    isSelectable: boolean;
    onSelect?: (row: any) => void;
    selectedRowIndex?: number;
};

type TableRowProps<T> = {
    isSelected?: boolean;
    rowIndex: number;
    item: T;
    keysValues: (keyof T)[];
    isSelectable: boolean;
    onSelect?: (row: any) => void;
    //   selectRowFunc?: (rowIndex: number) => void;
};

// // Textbox // //

enum FontSizes {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

interface TextboxProps {
    prevData?: string;
    isEditMode: boolean;
    fontSizeProps: FontSizes;
    placeHolder?: string;
    value: string | undefined;
    onChange: (text: string) => void;
    errorMode?: boolean;
}

// // Tooltip // //

enum TooltipColors {
    GREEN = 'green',
    RED = 'red',
    WHITE = 'white',
}

interface tooltipProps {
    className?: string;
    placeholder?: string | number;
    isFloating: boolean;
    deletable?: boolean;
    editMode?: boolean;
    color: TooltipColors;
    onDelete?: () => void;
    value?: number | string;
    onEdit?: (val: number | string) => void;
    onSave?: (newVal: number) => void;
}

// // Upload // //

interface UploadProps {
    label: string;
    inputName?: string;
    isDisabled?: boolean;
    isMultiple: boolean;
    errorMode?: boolean;
    showMode: boolean;
    filesTypes: string;
    bucketName: BucketsNames;
    exerciseType: ExercisesTypes;
    files: FileType | FileType[] | undefined;
    // onFileChange: (files: File | FileList | null) => void;
    onFileChange: (files: File | File[] | null) => void;
    onFileRemoved: (fileIndex: number | undefined) => void;
    fileLength?: (size: number | null) => void;
}

interface UploadRef {
    focus: () => void;
    clear: () => void;
}