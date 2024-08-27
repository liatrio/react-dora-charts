declare module 'react-dropdown' {
	import * as React from 'react';

	interface DropdownProps {
	  options: string[];
	  onChange: (option: { value: string; label: string }) => void;
	  value?: string;
	  placeholder?: string;
	}

	export default class Dropdown extends React.Component<DropdownProps> {}
  }
