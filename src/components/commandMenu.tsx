interface CommandMenuProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    command: string;
    setCommand: (command: string) => void;
    position : {x:number, y:number}
}
function CommandMenu({open, setOpen, command, setCommand, position} : CommandMenuProps) {
    return ( 
        <div className={`absolute bg-bg-secondary top-12 ${open ? 'block' : 'hidden'}`}> 
            hello
        </div>
     );
}

export default CommandMenu;