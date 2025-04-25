import rawRealTimeData from '../constants/real_time_data.json';
import Measurement from '../entities/RealTimeSchedule';
import { FlatMeasurement, RealTimeData } from '../types';

let insertionIndex = 0;
let targetMeasurements: FlatMeasurement[] = [];
const TARGET_DATE = "2023-09-30";
const EXPECTED_RECORDS_PER_CYCLE = 96;
const INSERTION_DELAY_MS = 1000;

function flattenAndFilterData(rawData: RealTimeData[]): FlatMeasurement[] {
    const flatList: FlatMeasurement[] = [];
    const targetRecord = rawData.find(record => record.date === TARGET_DATE);

    if (!targetRecord) {
        return [];
    }

    const { qseId, groupId } = targetRecord.payload;
    const measurementDate = targetRecord.date;

    targetRecord.data.forEach(measurement => {
        // Directly use the string timestamp from the JSON
        flatList.push({
            qseId,
            groupId,
            measurementDate,
            timestamp: measurement.timestamp, // Assign the string directly
            PV_pImm: measurement.PV_pImm,
            PV_pDA: measurement.PV_pDA,
            PV_raw: measurement.PV_raw,
            genValue_Imm: measurement.genValue_Imm,
            genValue_DA: measurement.genValue_DA,
            soc: measurement.soc,
            version: measurement.version
        });
    });

    // Optional: Sort if the order within the JSON 'data' array isn't guaranteed
    flatList.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (flatList.length !== EXPECTED_RECORDS_PER_CYCLE) {
        console.warn(`Warning: Expected ${EXPECTED_RECORDS_PER_CYCLE} records for ${TARGET_DATE}, but found ${flatList.length}.`);
    } else {
        console.log(`Successfully extracted ${flatList.length} measurements for ${TARGET_DATE}.`);
    }


    return flatList;
}

async function insertSingleMeasurement(measurementData: FlatMeasurement): Promise<void> {
    try {
        await Measurement.updateOne(
            { timestamp: measurementData.timestamp }, // Find by the unique string timestamp
            { $set: measurementData },                // Data to insert or update with
            { upsert: true }                          // Insert if not found, update if found
        );
        console.log(`[${insertionIndex + 1}/${targetMeasurements.length}] Inserted/Updated: ${measurementData.timestamp}`);
    } catch (error) {
        console.error(`Failed to insert measurement for ${measurementData.timestamp}:`, error);
        // throw error; // Uncomment to stop the entire process on the first error
    }
}

/**
 * Schedules the next insertion OR handles cycle completion (delete & reset).
 */
async function scheduleNextInsertion(): Promise<void> { // Added async for await deleteMany
    // Check if we have completed a cycle (inserted all target measurements)
    if (insertionIndex >= targetMeasurements.length) {
        console.log('------------------------------------');
        console.log(`Cycle complete. ${targetMeasurements.length} records inserted for ${TARGET_DATE}.`);

        try {
            console.log(`Deleting all records from ${Measurement.collection.name}...`);
            const deleteResult = await Measurement.deleteMany({}); // Delete all documents in the collection
            console.log(`Deletion complete. ${deleteResult.deletedCount} records removed.`);
        } catch (deleteError) {
            console.error("Error deleting records:", deleteError);
            // Decide how to proceed. Maybe wait and retry, or stop.
            console.log("Stopping insertion loop due to deletion error.");
            return; // Stop if deletion fails
        }

        insertionIndex = 0;
        setTimeout(scheduleNextInsertion, INSERTION_DELAY_MS);
        return; // Exit this execution context
    }

    // --- If cycle is not complete, insert the next record ---
    const measurementToInsert = targetMeasurements[insertionIndex];

    // Insert the data and schedule the next run
    insertSingleMeasurement(measurementToInsert)
        .then(() => {
            insertionIndex++; // Increment index *after* successful scheduling or completion
            // Schedule the next check/insertion
            setTimeout(scheduleNextInsertion, INSERTION_DELAY_MS);
        })
        .catch(error => {
            // This catch is mainly if insertSingleMeasurement throws an error and stops the chain
            console.error("Stopping insertion loop due to critical insertion error:", error);
        });
}

/**
 * Main function to initialize and start the sequential data insertion process.
 */
export async function startRealTimeDataInsertion() {
    try {
        console.log('Initializing real-time data insertion loop...');

        // 1. Load and Filter Data for the Target Date
        const loadedRawData = rawRealTimeData as RealTimeData[];
        targetMeasurements = flattenAndFilterData(loadedRawData);

        if (targetMeasurements.length === 0) {
            console.error(`No data found for target date ${TARGET_DATE}. Cannot start insertion cycle. Exiting.`);
            return;
        }
        if (targetMeasurements.length !== EXPECTED_RECORDS_PER_CYCLE) {
            console.warn(`Data count mismatch for ${TARGET_DATE}. Proceeding with ${targetMeasurements.length} records per cycle.`);
        }

        insertionIndex = 0;
        console.log(`Starting insertion cycle for ${targetMeasurements.length} records from ${TARGET_DATE}. Delay: ${INSERTION_DELAY_MS / 1000}s.`);
        scheduleNextInsertion();

    } catch (error) {
        console.error('Error during insertion process initialization:', error);
    }
}