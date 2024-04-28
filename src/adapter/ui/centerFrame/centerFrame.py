import customtkinter

from src.adapter.ui.centerFrame.requestFrame import RequestFrame


class CenterFrame(customtkinter.CTkFrame):
    def __init__(self, master):
        super().__init__(master)

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)
        self.configure(bg_color="transparent", fg_color="transparent")
        self.requestFrameCollapsed = False
        self.responseFrameCollapsed = False

        def toggle_request_frame_size():
            if self.requestFrameCollapsed:
                self.grid_rowconfigure(0, weight=1)
                self.requestFrameCollapsed = False
            else:
                self.grid_rowconfigure(0, weight=0)
                self.requestFrameCollapsed = True

        def toggle_response_frame_size():
            if self.responseFrameCollapsed:
                self.grid_rowconfigure(1, weight=1)
                self.responseFrameCollapsed = False
            else:
                self.grid_rowconfigure(1, weight=0)
                self.responseFrameCollapsed = True

        self.requestFrame = RequestFrame(self, toggle_frame_size=toggle_request_frame_size)
        self.requestFrame.grid(row=0, column=0, padx=0, pady=0, sticky="nswe")

        self.responseFrame = RequestFrame(self, toggle_frame_size=toggle_response_frame_size)
        self.responseFrame.grid(row=1, column=0, padx=0, pady=10, sticky="nswe")
