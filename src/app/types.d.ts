////////////////////////////////

// ~~~~~~~ API ~~~~~~~ //

// // courses service // //

// ------ courses ------- //

interface CoursesType {
    _id: string;
    name: string;
    units: string[];
    suspendedUnits: string[];
}

// ------ units ------- //

interface UnitType {
    _id: string;
    levels: string[];
    suspendedLevels: string[];
    guidebook?: string;
    description?: string;
}

// ------ levels ------- //

interface LevelType {
    _id: string;
    lessons: string[];
    suspendedLessons: string[];
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
    exercises: string[];
    suspendedExercises: string[];
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

interface FSAType {
    _id: string;
    relevant?: string[];
    answersList: string[]; //may be 2 correct answers
    acceptableAnswers?: string[];
    timeBuffers: TimeBuffersType[];
    description?: string;
    dateCreated: Date;
    recordKey: string;
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

interface RecordMetadataType {
    record_length: number;
    sonograms_ids: string[];
    difficulty_level: number;
    targets_ids_list?: string[];
    targets_list?: string[];
    operation: string | undefined;
    source_id: string | undefined;
    is_in_italy: boolean;
    signature_type: SignatureTypes;
    channels_number: number;
    sonar_system: SonarSystem;
    is_backround_vessels: boolean;
    aux: boolean;
}

interface SonogramMetadataType {
    sonogram_type: SonarSystem;
    fft: number;
    bw: number;
}

interface RecordType {
    name: string;
    id?: string;
    metadata: Partial<RecordMetadataType>;
}

interface SonogramType {
    name: string;
    id?: string;
    metadata: Partial<SonogramMetadataType>;
}

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

enum PopupsTypes {
    CLOSED = "closed",
    NEWUSER = "newUser",
    NEWCOURSE = "newCourse",
    NEWUNIT = "newUnit",
    STARTLESSON = "startLesson",
    ADMINEDIT = "adminEdit",
    RECORDMETADATA = 'recordMetadata',
    SONOLISTMETADATA = 'sonolistMetadata'
}

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

enum FSAFieldsType {
    DESCRIPTION = 'description',
    RELEVANT = 'relevant',
    TIMEBUFFERS = 'timeBuffers',
}

////////////////////////////////

// ~~~~~~~ COMPONENTS ~~~~~~~ //

// // Button // //

enum ButtonColors {
    BLUE = 'Blue',
    GREEN = 'Green',
    GRAY = 'Gray',
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
    isMultiple: boolean;
    errorMode?: boolean;
    filesTypes: string;
    files: RecordType | SonogramType[] | undefined;
    // onFileChange: (files: File | FileList | null) => void;
    onFileChange: (files: File | File[] | null) => void;
    onFileRemoved: (fileIndex: number | undefined) => void;
    fileLength?: (size: number | null) => void;
}

interface UploadRef {
    focus: () => void;
    clear: () => void;
}