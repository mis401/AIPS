import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextSnippetRoundedIcon from '@mui/icons-material/TextSnippetRounded';

// const options = ['Text Document', 'To-do List', 'Whiteboard'];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  selectedOption: string | null;
  onCreateButtonClick: () => void;
  title: string;
  options: string[];
  buttonText: string;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open, selectedOption, onCreateButtonClick, title, options, buttonText } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {options.map((option) => (
          <ListItem disableGutters key={option}>
            <ListItemButton
              selected={option === selectedOption}
              onClick={() => handleListItemClick(option)}
            >
              <ListItemAvatar>
                <Avatar>
                  <TextSnippetRoundedIcon style={{ color: 'secondary' }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={option} />
            </ListItemButton>
          </ListItem>
        ))}
        <div className='createButtonDiv'>
          <Button onClick={onCreateButtonClick}>{buttonText}</Button>
        </div>
      </List>
    </Dialog>
  );
}

export default SimpleDialog;
