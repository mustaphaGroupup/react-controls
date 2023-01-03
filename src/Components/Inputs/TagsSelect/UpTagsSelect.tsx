import React, { useState } from 'react';
import classnames from 'classnames';
import { useTheme } from '../../../Common/hooks/useTheme';
import { UpTag, TagData } from '../../Display/Tag';
import { getLabelStyles, getLabelWrapperStyles, getTagsWrapperStyles } from './UpTagsSelect.style';
import { findAndUpdateSelectedTag } from './UpTagsSelect.helper';

interface Props {
  tags: TagData[];
  label?: string;
  onChange?: (e: React.MouseEvent, tags: TagData[]) => void;
  multipleSelection?: boolean;
}

const UpTagsSelect: React.VFC<Props> = ({ tags, onChange, label, multipleSelection = true }) => {
  const theme = useTheme();
  const [selectedTags, setSelectedTags] = useState(tags);

  const handleTagSelected = (e: React.MouseEvent, data: TagData): void => {
    //TODO: to remove on react/testing library update
    e.persist();
    const updatedSelectedTags = findAndUpdateSelectedTag(selectedTags, data, multipleSelection);

    setSelectedTags(updatedSelectedTags);
    onChange?.(e, updatedSelectedTags);
  };

  const tagsWrapperStyles = getTagsWrapperStyles();
  const labelWrapperStyles = getLabelWrapperStyles(theme);
  const labelStyles = getLabelStyles(theme);

  return (
    <div>
      {label && (
        <p className={classnames(labelWrapperStyles)}>
          <label className={classnames(labelStyles)}>{label}</label>
        </p>
      )}
      <div className={classnames(tagsWrapperStyles)}>
        {selectedTags.map(tag => (
          <UpTag id={tag.id} text={tag.text} selected={tag.selected} onChange={handleTagSelected} key={tag.id} />
        ))}
      </div>
    </div>
  );
};

export { UpTagsSelect, Props };