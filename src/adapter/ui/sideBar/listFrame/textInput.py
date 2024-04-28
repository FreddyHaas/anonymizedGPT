import customtkinter

from src.adapter.persistence.PersistenceAdapter import PersistenceAdapter
from src.adapter.ui.sideBar.listFrame.wordButtons import WordButtons
from src.application.ChangeSettingsUseCase import ChangeSettingsUseCase


class TextInput(customtkinter.CTkFrame):
    def __init__(self, master, deny_list=False):
        super().__init__(master)

        self.deny_list = deny_list

        self.textInput_var = customtkinter.StringVar()
        self.grid_columnconfigure(0, weight=1)

        self.configure(bg_color="transparent", fg_color="transparent")
        self.textInput = customtkinter.CTkEntry(self, textvariable=self.textInput_var)
        self.textInput.grid(row=0, column=0, pady=5, padx=0)
        self.textInput.bind('<Return>', self.add_new_word_to_allow_list)

        self.settings = ChangeSettingsUseCase.get_instance(PersistenceAdapter.get_instance())
        self.word_list = self.load_word_list()
        self.load_buttons()

    def remove_word(self, word):
        self.word_list.remove(word)
        self.delete_word(word)
        self.load_buttons()

    def add_new_word_to_allow_list(self, event):
        word = self.textInput_var.get()
        self.word_list.append(word)
        self.save_word(word)
        self.textInput_var.initialize("")
        self.load_buttons()

    def load_buttons(self):
        if hasattr(self, "words"):
            self.words.grid_remove()
        self.words = WordButtons(
            self,
            list_of_words=self.word_list,
            remove_word=self.remove_word,
            deny_list=self.deny_list
            )
        self.words.grid(row=1, column=0)

    def load_word_list(self) -> [str]:
        if self.deny_list:
            return self.settings.get_all_deny_list_items()
        else:
            return self.settings.get_all_allow_list_items()

    def save_word(self, word: str):
        if self.deny_list:
            self.settings.save_deny_list_item(word)
        else:
            self.settings.save_allow_list_item(word)

    def delete_word(self, word: str):
        if self.deny_list:
            self.settings.delete_deny_list_item(word)
        else:
            self.settings.delete_allow_list_item(word)
