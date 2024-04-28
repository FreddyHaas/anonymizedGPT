import customtkinter

from src.adapter.persistence.PersistenceAdapter import PersistenceAdapter
from src.application.ChangeSettingsUseCase import ChangeSettingsUseCase


class OptionCheckbox(customtkinter.CTkFrame):
    def __init__(self, master, var_name: str, display_name: str):
        super().__init__(master, fg_color="transparent")

        persistence = PersistenceAdapter.get_instance()
        self.change_setting_use_case = ChangeSettingsUseCase.get_instance(persistence)
        self.var_name = var_name
        self.var = customtkinter.IntVar(value=self.load_setting())

        self.checkbox = customtkinter.CTkCheckBox(self, text=display_name, command=self.save_setting,
                                                  variable=self.var, onvalue=1, offvalue=0, checkbox_width=18,
                                                  checkbox_height=18, height=20)
        self.checkbox.grid(row=0, column=0, padx=0, pady=0, sticky="nwse")

    def save_setting(self):
        self.change_setting_use_case.save_entity(self.var_name, self.var.get())

    def load_setting(self) -> int:
        return self.change_setting_use_case.get_entity(self.var_name)
