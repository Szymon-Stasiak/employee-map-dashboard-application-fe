import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 220,
    },
  },
};

type Props = {
  label: string;
  items: string[];
  onFilterChanged: (selectedItems: string[]) => void;
};

const ALL = 'All';

function MultipleSelect({ label, items, onFilterChanged }: Props) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([ALL]);

  const handleChange = (event: SelectChangeEvent<typeof selectedItems>) => {
    const {
      target: { value },
    } = event;

    if (typeof value === 'string') {
      setSelectedItems([value]);
      onFilterChanged([value]);
    } else {
      let newSelectedItems = value;

      if (selectedItems.includes(ALL) && newSelectedItems.length > 1) {
        newSelectedItems.splice(newSelectedItems.indexOf(ALL), 1);
      } else if ((newSelectedItems.includes(ALL) && newSelectedItems.length > 1) || newSelectedItems.length == 0) {
        newSelectedItems = [ALL];
      }

      setSelectedItems(newSelectedItems);
      onFilterChanged(newSelectedItems);
    }
  };

  return (
    <FormControl sx={{ m: 1, width: 220 }}>
      <InputLabel id={label}>{label}</InputLabel>
      <Select
        labelId={label}
        id={label}
        multiple
        value={selectedItems}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        MenuProps={MenuProps}
      >
        <MenuItem key={ALL} value={ALL}>
          All
        </MenuItem>
        {items.map((itemLabel) => (
          <MenuItem key={itemLabel} value={itemLabel}>
            {itemLabel}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export { ALL };
export default MultipleSelect;
