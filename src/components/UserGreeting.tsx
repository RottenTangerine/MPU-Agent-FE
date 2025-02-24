import { Transition } from '@headlessui/react';

interface UserGreetingProps {
    name: string;
    onClear: () => void;
}

export const UserGreeting = ({ name, onClear }: UserGreetingProps) => (
    <Transition
        appear
        show={!!name}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-800">
                Hello, <span className="text-blue-600">{name}</span>! 👋
            </h1>
            <button
                onClick={onClear}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors w-full"
            >
                Clear Name
            </button>
        </div>
    </Transition>
);