import customtkinter

from src.adapter.ui.sideBar.standardSettings.optionCheckbox import OptionCheckbox


class StandardSettingsOptions(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        self.configure(bg_color="transparent", fg_color="transparent")

        self.name_checkbox = OptionCheckbox(self, var_name="PERSON", display_name="Name")
        self.name_checkbox.grid(row=0, column=0, padx=10, pady=5, sticky="w")

