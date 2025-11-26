# Docker container for testing codesurf-ai npm installation
FROM node:20-slim

# Install basic tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create test directory
WORKDIR /test

# Copy test script
COPY test-install.sh /test/test-install.sh
RUN chmod +x /test/test-install.sh

# Default command runs the test
CMD ["/test/test-install.sh"]
