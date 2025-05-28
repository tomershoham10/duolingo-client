////////////////////////////////

// ~~~~~~~ API ~~~~~~~ //

// // courses service // //

// ------ courses ------- //

interface CoursesType {
    _id: string;
    name: string;
    description: string;
    levelsIds: string[];
    suspendedLevelsIds: string[];
}

// ------ units ------- //

interface UnitType {
    name: string | undefined;
    _id: string;
    levelsIds: string[];
    suspendedLevelsIds: string[];
    guidebookId?: string;
    description?: string;
}

// ------ levels ------- //

export interface LevelType {
    _id: string;
    name: string;
    lessonsIds?: string[];
    suspendedLessonsIds?: string[];
    exercisesIds?: string[];
    suspendedExercisesIds?: string[];
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

export enum ExercisesTypes {
    FSA = "fsa",
    SPOTRECC = "spotrecc"
}

export enum FileTypes {
    RECORDS = 'records',
    IMAGES = 'images'
}

interface FileRoute {
    mainId: string;
    subTypeId: string;
    modelId: string;
    fileType: FileTypes;
    objectName: string;
}

export interface ExerciseType {
    _id: string
    dateCreated: Date;
    type: ExercisesTypes;
    adminComments?: string;
}

//~~~~~~~~~~~ FSA ~~~~~~~~~~~//

interface TimeBuffersType {
    timeBuffer: number;
    grade: number;
}

enum FeaturesList {
    NUMBER_OF_BLADES = 'numberOfBlades',
}

interface FeatureObject {
    type: FeaturesList;
    value: number | string;
}

export interface FsaType extends ExerciseType {
    // targetsList?: string[]; //may be 2 correct answers
    timeBuffers: TimeBuffersType[];
    description?: string;
    fileRoute: FileRoute;

    relevant?: string[];
    // acceptableTargets?: string[];
}

//~~~~~~~~~~~ SPOTRECC ~~~~~~~~~~~//
interface SpotreccSubExercise {
    description?: string;
    fileRoute: FileRoute;
    exerciseTime: number; // in seconds
    bufferTime: number; // in seconds
}

export interface SpotreccType extends ExerciseType {
    subExercises: SpotreccSubExercise[];
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

export interface ResponseTargetType extends TargetType {
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

export interface TargetType {
    // as in posi
    _id: string;
    name: string;
    organization?: string[];
    father?: string;
    children: string[];
    level: number;
    created: Date;
    updated: Date;
    // countryId: string;
    // type: TypesOfTargets;
    // subType: TypesOfVessels | TypesOfTorpedos | TypesOfSonars;
}

// ------ RELEVANT ------- //

interface RelevantAmlachType {
    countries: string[];
    organization: string[];
    amlach_main_type: string | null;
    amlach_sub_type: string | null;
    model: string | null;
  }
  
  interface RelevantType {
    // as in posi
    _id: string;
    relevant_name: string;
    amlach: RelevantAmlachType[];
    recived_date: Date;
    update_date: Date;
  }

// ------ ORGANIZATION ------- //

interface OrganizationType {
    _id: string;
    organization_name: string;
    country: string;
}

// ------ COUNTRIES ------- //

interface CountryType {
    _id: string;
    country_name: string;
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

type Metadata = RecordMetadata | ImageMetadata;

interface RecordMetadata {
    record_length: number;
    difficulty_level: number;
    number_of_channels: number;
    sonograms_names: string[];
    targets_ids_list: string[];
    operation: string | null;
    source_id: string | null;
    is_in_italy: boolean;
    aux: boolean;
    is_backround_vessels: boolean;
    signature_type: SignatureTypes;
    sonar_system: SonarSystem;
}

interface ImageMetadata {
    sonogram_type: SonarSystem;
    fft: number;
    bw: number;
}

interface FileType {
    name: string;

    id?: string;
    // exerciseType: ExercisesTypes;
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

export interface UserType {
    _id: string;
    userName: string;
    permission: string;
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

////////////////////////////////

// ~~~~~~~ COMPONENTS ~~~~~~~ //

// // AudioPlayer // //

export enum AudioPlayerSizes {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export interface AudioPlayerProps {
    src: string;
    isDisabled?: boolean;
    isPauseable?: boolean;
    isAutoPlay?: boolean;
    size?: AudioPlayerSizes;
    onPlay?: () => void;
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
    className?: string;
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
    value?: string | nubmer | undefined;
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

// // RoundButton // //

interface RoundButtonProps {
    label?: string;
    Icon: IconType;
    className?: string;
    onClick: () => void;
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
    state: boolean;
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