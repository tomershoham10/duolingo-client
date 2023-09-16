
import LessonButton from "./components/LessonButton/page";
import UnitSection from "./components/UnitSection/page";

export default function Home() {

    return (
        <div className="p-4">
            <h1>Hi</h1>
            <UnitSection />
            <LessonButton isDisabled={false} />
        </div>
    );
}
