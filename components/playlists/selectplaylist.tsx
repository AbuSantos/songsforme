import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SelectProps = {
    placeholder: string;
    label?: string;
    handleSelectChange: (value: string) => void;
    data: dataProps[]

};

type dataProps = {
    id: string
    playlist_name: string | null
    playlistId: string
}


// export const SelectPlaylist = ({ placeholder, label, data, handleSelectChange, classname, edit }: SelectProps) => {
export const SelectPlaylist = ({ placeholder, label, data, handleSelectChange }: SelectProps) => {
    return (
        <Select onValueChange={handleSelectChange}>
            <SelectTrigger className={`w-3/6`}>
                <SelectValue placeholder={placeholder}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {
                        data && data?.map((item: dataProps, index: number) => (
                            <SelectItem key={item.id} value={JSON.stringify({ id: item.id, bus_product_name: item.bus_product_name })}>
                                <div className="space-x-1">
                                    <span>
                                        {item.playlist_name}
                                    </span>
                                </div>
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

