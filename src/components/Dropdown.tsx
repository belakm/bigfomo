import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledDropdownContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const StyledDropdownLabel = styled.div`
  border-bottom: 1px solid #002b3f;
  color: #002b3f;
  font-weight: 500;
  cursor: pointer;
  > small {
    padding-left: 1em;
    font-size: 0.5em;
  }
`;

const StyledDropdownOption = styled.div`
  cursor: pointer;
  line-height: 1.8;
  padding: 0.5em 1em;
  :hover {
    background-color: #ffe1f2;
  }
`;

interface DropdownProps<K = string | number> {
  options: { value: K; label: any }[];
  onChange: (value: K) => void;
  initialValue: K;
}

const Dropdown = ({ options, onChange, initialValue }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | number>(
    initialValue
  );
  const dismiss = () => setIsOpen(false);
  useEffect(() => {
    selectedValue && onChange(selectedValue);
  }, [selectedValue]);
  return (
    <StyledDropdown>
      <StyledDropdownLabel onClick={() => setIsOpen(!isOpen)}>
        {options.find(({ value }) => value === selectedValue)?.label}{" "}
        <small>▼</small>
      </StyledDropdownLabel>
      <StyledDropdownContent isOpen={isOpen}>
        {options.map(({ value, label }) => (
          <StyledDropdownOption
            key={value}
            onClick={() => {
              setSelectedValue(value);
              dismiss();
            }}
          >
            {label}
          </StyledDropdownOption>
        ))}
      </StyledDropdownContent>
    </StyledDropdown>
  );
};

export default Dropdown;
