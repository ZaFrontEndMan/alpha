#!/bin/bash

# Admin Panel Data Backup Script
# Creates a timestamped backup of site-data.json

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="data/backups"
SOURCE_FILE="data/site-data.json"
BACKUP_FILE="$BACKUP_DIR/site-data-$TIMESTAMP.json"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Error: $SOURCE_FILE not found!"
    exit 1
fi

# Create backup
cp "$SOURCE_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully:"
    echo "   📁 $BACKUP_FILE"
    echo ""
    echo "File size: $(du -h $BACKUP_FILE | cut -f1)"
    echo ""
    echo "To restore this backup, run:"
    echo "   cp $BACKUP_FILE $SOURCE_FILE"
else
    echo "❌ Backup failed!"
    exit 1
fi
