FROM mcr.microsoft.com/devcontainers/typescript-node:26-bookworm

ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo
ENV PATH="/usr/local/cargo/bin:${PATH}"

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --no-modify-path && \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME

ENV PATH="/home/vscode/.cargo/bin:${PATH}"